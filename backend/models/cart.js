"use strict";

const db = require("../db");
const { ensureCorrectUser } = require('../middleware/auth');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

/** Related functions for carts. */

class Cart {

  /** create
   * 
   * Given a username then creates and returns new cart for user. Checks to see that username is valid. If not, throws NotFoundError. Checks to see that there is only one cart per user. 
   * 
   * Given: username
   * 
   * Returns: 
   *  cart = {username, products[], total } 
   **/
  static async create(username) {
    const validUser = await db.query(
      `SELECT username FROM users
      WHERE username = $1;
      `, 
      [username]
    )

    if (!validUser.rows[0]) {
      throw new NotFoundError("Cannot make cart. User not found.")
    }

    const cartRes = await db.query(
      `SELECT u.username, c.products, c.total
      FROM carts c
      JOIN users u ON c.username = u.username
      WHERE u.username = $1;
      `,
    [username],
    );

    if (cartRes.rows[0]) {
      throw new BadRequestError(`User can only have one cart.`)
    }

    const result = await db.query(
          `INSERT INTO carts
           (username)
           VALUES ($1)
           RETURNING username, products, total`,
        [
          username,
        ],
    );

    const cart = result.rows[0];

    cart.total = parseFloat(cart.total);

    return cart;
  }

  /** get
   * 
   * Given a username then gets user's cart from use of foreign key. If a cart cannot be found based on username, throws NotFoundError. 
   * 
   * Given: username
   * 
   * Returns: 
   *  cart = {username, products[], total}
   **/

  static async get(username) {
    const cartRes = await db.query(
          `SELECT u.username, c.products, c.total
          FROM carts c
          JOIN users u ON c.username = u.username
          WHERE u.username = $1;
          `,
        [username],
    );

    const cart = cartRes.rows[0];

    if (!cart) throw new NotFoundError("User not found.");

    cart.total = parseFloat(cart.total);

    return cart;
  }

  /** update
   * 
   * Given a username and data including a product sku, an action (either "add", or "remove"), and productPrice. Updates products and cart total. Throws BadRequestError if data is not provided. If cart is not found for username, throws NotFoundError. Depending on action given, cart will update differently. "Add" action will update products with productSku and add productPrice to total. "Remove" action will slice productSku out of products and subtract productPrice from total. Returns updated cart.  
   *
   * Given: username, data {productSku, action, productPrice}
   * 
   * Returns: 
   *  cart = {username, products[], total}
   */

  static async update(username, data) {
    let { productSku, action, productPrice } = data
    let updatedCart;

    const cartRes = await db.query(
        `SELECT products FROM carts
        WHERE username = $1;
        `, 
        [username]
    )

    if (!cartRes.rows[0]) throw new NotFoundError(`No cart with username: ${username}`)

    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No data provided for update.");
    }    
    
    const products = cartRes.rows[0].products || [];

    if (action == "add") {
      updatedCart = [...products, productSku]
    } else if (action == "remove") {
        const indexToRemove = products.indexOf(productSku);
        if (indexToRemove !== -1) {
            updatedCart = [
                ...products.slice(0, indexToRemove),
                ...products.slice(indexToRemove + 1)
            ];
        } else {
            updatedCart = products;
            throw new BadRequestError(`Product ${productSku} not found in the cart.`)
        }

        productPrice *= -1;
    }

    try {
      const querySql = await db.query(
        `UPDATE carts
        SET products = $1,
            total = total + $2
        WHERE username = $3
        RETURNING username, products, total::numeric`,
        [updatedCart, productPrice, username]
      );
    
      const cart = querySql.rows[0]
      
      cart.total = parseFloat(cart.total);

      return cart
    } catch {
      throw new BadRequestError("Cart total cannot be less than 0.")
    }
  }
}

module.exports = Cart;
