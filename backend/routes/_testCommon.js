"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Cart = require("../models/cart");
const Order = require("../models/order");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM carts");
  await db.query("DELETE FROM orders");

  await User.register({
    username: "testuser",
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    password: "password1",
  });

  await User.register({
    username: "testuser2",
    firstName: "Test2",
    lastName: "Test2",
    email: "test2@test.com",
    password: "password2",
  });

  await User.register({
    username: "testuser3",
    firstName: "Test3",
    lastName: "Test3",
    email: "test3@test.com",
    password: "password3",
  });

  await Cart.create("testuser")
  await Cart.create("testuser2")
  await Cart.create("testuser3")
  
  await Cart.update("testuser", {
    productSku: "KZ231211", 
    action: "add",
    productPrice: 345.22,
  })

  await Cart.update("testuser", {
    productSku: "K0293113", 
    action: "add",
    productPrice: 34.99,
  })

  await Cart.update("testuser2", {
    productSku: "BZ231211", 
    action: "add",
    productPrice: 234.23,
  })

  await Cart.update("testuser3", {
    productSku: "DZ231211", 
    action: "add",
    productPrice: 65.95,
  })

  await Order.create("testuser", {
    products: ["KZ23104", "K0293113"], 
    total: 233.87,
    shippingAddress: "Test"
  })

  await Order.create("testuser", {
    products: ["BZ2393434", "K0293113"], 
    total: 500.34,
    shippingAddress: "Test"
  })

  await Order.create("testuser2", {
    products: ["MZ23829032", "L023232323"], 
    total: 858.45,
    shippingAddress: "Test"
  })

  await Order.create("testuser3", {
    products: ["T29392323", "N0220323"], 
    total: 900.44,
    shippingAddress: "Test"
  })
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


const testToken = createToken({ username: "testuser" });
const test2Token = createToken({ username: "testuser2" });
const test3Token = createToken({ username: "testuser3" });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testToken, 
  test2Token, 
  test3Token
};
