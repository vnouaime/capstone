// Sample test data that can be applied to model tests
const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM carts");
    await db.query("DELETE FROM orders");

    await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('testuser', $1, 'Test', 'Test', 'test@email.com'),
               ('testuser2', $2, 'Test2', 'Test2', 'test2@email.com'),
               ('testuser3', $3, 'Test3', 'Test3', 'test3@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
    ]);

    await db.query(`
        INSERT INTO carts(username, products, total)
        VALUES ('testuser', ARRAY['W0000947', 'DZ347374'], 546.78),
            ('testuser2', ARRAY['BZ045667', 'B00653435'], 2343.98)
            `);

    await db.query(`
        INSERT INTO orders (username, products, total, shipping_address, ordered_on)
        VALUES 
            ('testuser', ARRAY['W0000947', 'DZ347374'], 546.78, '41 testing road, Test, TE, 12345',          CURRENT_TIMESTAMP),
            ('testuser', ARRAY['PL12281', 'L008181'], 2311.23, '41 testing road, Test, TE, 12345',          CURRENT_TIMESTAMP),
            ('testuser2', ARRAY['BZ045667', 'B00653435'], 2343.98, '101 testing2 road, Test2, MA, 54321', CURRENT_TIMESTAMP)
            `);

  
}
async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};