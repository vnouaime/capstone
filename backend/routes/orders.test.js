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

/************************************** POST /orders/:username */

describe("POST /orders/:username", function () {
    test("works for same user", async function () {
        const resp = await request(app)
            .post("/orders/testuser")
            .set("authorization", `Bearer ${testToken}`)
            .send({
                products: ["KZ232932", "D02323333"], 
                total: 1000.23, 
                shippingAddress: "Test"
            });
    
        const order = resp.body.order;

        expect(order.id).toEqual(expect.any(Number));
        expect(order.products).toEqual(["KZ232932", "D02323333"]);
        expect(order.total).toEqual(1000.23);
        expect(order.shippingAddress).toEqual("Test");
        expect(new Date(order.orderedOn)).toEqual(expect.any(Date)); 
    });  
  
    test("unauth if not same user", async function () {
        const resp = await request(app)
        .post(`/orders/testuser`)
        .send({
            products: ["KZ232932", "D02323333"], 
            total: 1000.23, 
            shippingAddress: "Test"
        })
        .set("authorization", `Bearer ${test2Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
        .post(`/orders/testuser`)
        .send({
            products: ["KZ232932", "D02323333"], 
            total: 1000.23, 
            shippingAddress: "Test"
        });

        expect(resp.statusCode).toEqual(401);
    });

    test("bad request if invalid data", async function () {
        const resp = await request(app)
        .post(`/orders/testuser`)
        .send({
            total: "475.65"
        })
        .set("authorization", `Bearer ${testToken}`);

        expect(resp.statusCode).toEqual(400);
    });
  
    test("bad request with missing data", async function () {
      const resp = await request(app)
          .post("/orders/testuser")
          .send({
            products: ["KZ232932", "D02323333"], 
            total: 1000.23, 
            })
           .set("authorization", `Bearer ${testToken}`);
  
      expect(resp.statusCode).toEqual(400);
    });
}) 

/************************************** GET /orders/:username */

describe("GET /orders/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/orders/testuser`)
      .set("authorization", `Bearer ${testToken}`);

    const orders = resp.body.orders;

    orders.map(order => {
        expect(order.id).toEqual(expect.any(Number));
        expect(order.products).toEqual(expect.any(Array));
        expect(order.total).toEqual(expect.any(Number));
        expect(order.shippingAddress).toEqual("Test");
        expect(new Date(order.orderedOn)).toEqual(expect.any(Date)); 
    })
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/orders/testuser`)
      .set("authorization", `Bearer ${test2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/orders/testuser`);

    expect(resp.statusCode).toEqual(401);
  })
});
  

  

  