"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate
   * 
   * Given a username and password then authenticates user. Finds user first then validates password using bcrypt. If user is not found or password is invalid, throws UnauthorizedError.
   * 
   * Given: username, password
   * 
   * Returns: 
   *  user = { username, password, firstName,       lastName, email}
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** register
   *
   * Given username, password, firstName, lastName then creates and returns new user. Checks to see that username is unique from users table. If not, throws BadRequestError
   * 
   * Given: username, password, firstName, lastName
   * 
   * Returns: 
   *  user = {username, firstName, lastName, email}
   **/

  static async register(
      { username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Username taken: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** get
   * 
   * Given a username then returns data about user. If user is not found, throws NotFoundError. 
   * 
   * Given: username
   * 
   * Returns: 
   *  user = {username, firstName, lastName, email}
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`User not found: ${username}`);

    return user;
  }

  /** update
   * 
   * Given a username and data including firstName, lastName, password and/or email. Throws BadRequestError if data is not provided. Updates fields that were given and returns updated user. If user is not found, throws NotFoundError. 
   * 
   * Given: username, data {firstName, lastName, password, email}
   * 
   * Returns: 
   *  user = {username, firstName, lastName, email}
   */

  static async update(username, data) {
    // DOES NOT MATCH UP WITH CART.UPDATE. AUTHORIZATION ISSUE  
   
    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No data provided for update.");
    }  

    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`User not found: ${username}`);

    delete user.password
    return user;
  }

  /** remove
   * 
   * Given a username then deletes user from database and returns undefined. If user not found, throws NotFoundError 
   * 
   * Given: username
   * 
   * Returns: undefined
   */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`User not found: ${username}`);
  }
}


module.exports = User;
