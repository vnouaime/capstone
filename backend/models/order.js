"use strict";

const db = require("../db");
const {
  NotFoundError,
} = require("../expressError");

/** Related functions for orders. */

class Order {

  /** create
   * 
   * Given a username and data including products, total, shipping_address. Then, creates and returns new order for user. Checks to see that username is valid. If not, throws NotFoundError. 
   * 
   * Given: username, products, total, shippingAddress
   * 
   * Returns: 
   *  order = {
   *    id, 
   *    products, 
   *    total, 
   *    shippingAddress, 
   *    orderedOn
   * }
   **/

  static async create(username, data) {
    const { products, total, shippingAddress } = data
    
    const validUser = await db.query(
      `SELECT username FROM users
      WHERE username = $1;
      `, 
      [username]
    )

    if (!validUser.rows[0]) {
      throw new NotFoundError("Cannot make order. User not found.")
    }

    const result = await db.query(
      `INSERT INTO orders
        (username, products, total, shipping_address)
        VALUES ($1, $2, $3, $4)
        RETURNING id, 
                  products, 
                  total, 
                  shipping_address AS "shippingAddress", 
                  ordered_on AS "orderedOn"`,
    [
      username, products, total, shippingAddress
    ],
    );

    const order = result.rows[0];

    order.total = parseFloat(order.total);

    return order;
  }

  /** get
   * 
   * Given a username then gets user's orders from use of foreign key. If user is not found based on username, throws NotFoundError. 
   * 
   * Given: username
   * 
   * Returns: 
   *  orders = {
   *    [
   *      {
   *        id, 
   *        products, 
   *        total, 
   *        shippingAddress, 
   *        orderedOn
   *      }
   *    ]
   * }
   **/

  static async get(username) {
    const validUser = await db.query(
      `SELECT username FROM users
      WHERE username = $1;
      `, 
      [username]
    )

    if (!validUser.rows[0]) {
      throw new NotFoundError("User not found.")
    }

    const ordersRes = await db.query(
      `SELECT o.id, 
              o.products, 
              o.total, 
              o.shipping_address AS "shippingAddress", 
              o.ordered_on AS "orderedOn"
      FROM orders o
      JOIN users u ON o.username = u.username
      WHERE u.username = $1;
      `,
    [username],
    );

    const orders = ordersRes.rows;

    orders.map(order => {
      order.total = parseFloat(order.total)
    })
    
    return orders;
  }
}


module.exports = Order;
