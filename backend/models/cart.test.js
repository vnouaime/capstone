"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Cart = require("./cart.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
   
  test("works", async function () { 
    const username = "testuser3"  
    let cart = await Cart.create(username);

    expect(cart.username).toEqual(username)
    expect(cart.products).toBeNull()
    expect(cart.total).toBe(0)
  })

  test("throws NotFoundError if cart cannot be found with username", async function () {
      await expect(Cart.create("nonexistentusername")).rejects.toThrowError(NotFoundError);
  });

  test("throws BadRequestError if cart already exists under username", async function () {
      await expect(Cart.create("testuser")).rejects.toThrowError(BadRequestError);
  });
  
});

/************************************** get */
  
describe("get", function () {

  test("works", async function () {
    let cart = await Cart.get("testuser");

    expect(cart).toEqual({
      username: "testuser",
      products: ["W0000947", "DZ347374"], 
      total: 546.78
    });
  });

  test("throws NotFoundError if cart cannot be found with username", async function () {
    await expect(Cart.get("nonexistentusername")).rejects.toThrowError(NotFoundError);
  });

});
  
/************************************** update */
  
describe("update", function () {
  const username = "testuser"

  test("works: productSku, action (add), productPrice", async function () {
    const data = { productSku: "LZ342341", action: "add", productPrice: 45.23 }

    let cartRes = await Cart.update(username, data)

    expect(cartRes).toEqual({
      username,
      products: ["W0000947", "DZ347374", "LZ342341"],
      total: 592.01
    })
  });

  test("works: productSku, action (remove), productPrice", async function () {
    const data = { productSku: "W0000947", action: "remove", productPrice: 56.87}

    let cartRes = await Cart.update(username, data)

    expect(cartRes).toEqual({
      username,
      products: [ "DZ347374" ],
      total: 489.91
    })
  });

  test("throws BadRequestError if productSku being removed is not in products array", async function () {
    const data = { productSku: "LZ342341", action: "remove", productPrice: 232.34}

    await expect(Cart.update(username, data)).rejects.toThrowError(BadRequestError);
  });

  test("throws BadRequestError if cart total is less than 0", async function () {
    const data = { productSku: "W0000947", action: "remove", productPrice: 1000}

    await expect(Cart.update(username, data)).rejects.toThrowError(BadRequestError);
  });
  
  test("throws NotFoundError if cart cannot be found with username", async function () {
    const data = { productSku: "LZ342341", action: "add", productPrice: 232.34}

    await expect(Cart.update("nonexistentusername", data)).rejects.toThrowError(NotFoundError);
  });

  test("bad request with no data", async function () { 
    try {
      await Cart.update(username, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
  

  