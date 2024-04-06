"use strict";

const request = require("supertest")

const db = require("../db.js");
const app = require("../app")

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testToken, 
  test2Token, 
  test3Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /cart/:username */

describe("GET /cart/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/cart/testuser`)
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.body).toEqual({
        cart: {
            username: "testuser",
            products: ["KZ231211", "K0293113"], 
            total: 380.21
        }
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/cart/testuser`)
      .set("authorization", `Bearer ${test2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/cart/testuser`);

    expect(resp.statusCode).toEqual(401);
  })
});
  
/************************************** PATCH /cart/:username */
  
describe("PATCH /cart/:username", function () {
  const username = "testuser2"

  test("works for same user (adding product)", async function () {
    const resp = await request(app)
      .patch(`/cart/testuser2`)
      .send({
        productSku: "DZ23727372",
        action: "add", 
        productPrice: 34.99
      })
      .set("authorization", `Bearer ${test2Token}`);

    expect(resp.body).toEqual({
      cart: {
        username: "testuser2",
        products: ["BZ231211", "DZ23727372"], 
        total: 269.22
      },
    });
  });

  test("works for same user (removing product)", async function () {
    const resp = await request(app)
      .patch(`/cart/testuser`)
      .send({
        productSku: "K0293113",
        action: "remove", 
        productPrice: 34.99
      })
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.body).toEqual({
      cart: {
        username: "testuser",
        products: ["KZ231211"], 
        total: 345.22
      },
    });
  });

  test("400 status with request for productSku being removed that is not in products array", async function () {
    const resp = await request(app)
      .patch(`/cart/testuser`)
      .send({
        productSku: "DZ1928192",
        action: "remove", 
        productPrice: 34.99
      })
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.statusCode).toEqual(400)
  });

  test("400 status with cart total being less than 0", async function () {
    const resp = await request(app)
      .patch(`/cart/testuser`)
      .send({
        productSku: "K0293113",
        action: "remove", 
        productPrice: 1000
      })
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.statusCode).toEqual(400)
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .patch(`/cart/testuser`)
      .send({
        productSku: "DZ23727372",
        action: "add", 
        productPrice: 34.99
      })
      .set("authorization", `Bearer ${test2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/cart/testuser`)
      .send({
        productSku: "DZ23727372",
        action: "add", 
        productPrice: 34.99
      });

    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/cart/testuser`)
      .send({
        productSku: 2332,
      })
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.statusCode).toEqual(400);
  });
});
  

  