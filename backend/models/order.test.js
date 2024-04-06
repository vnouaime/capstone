"use strict";

const db = require("../db.js");
const { NotFoundError } = require("../expressError");
const Order = require("./order.js");
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
        const data = {
            products: ["ZXC23929", "MZ232444"], 
            total: 958.49, 
            shippingAddress: "21 Testing Road, Test, TE, 12345"
        }

        let order = await Order.create(username, data);

        order.products.forEach((product, index) => {
            expect(product).toBe(data.products[index]);
        });

        expect(order.total).toBe(data.total)
        expect(order.shippingAddress).toBe(data.shippingAddress)
        expect(order.orderedOn).toEqual(expect.any(Date))
    })

    test("throws NotFoundError if orders cannot be found with username", async function () {
        const data = {
            products: ["ZXC23929", "MZ232444"], 
            total: 958.49, 
            shippingAddress: "21 Testing Road, Test, TE, 12345"
        }

        await expect(Order.create("nonexistentusername", data)).rejects.toThrowError(NotFoundError);
    });
});

/************************************** get */
  
describe("get", function () {

    test("works", async function () {
      let orders = await Order.get("testuser");

      expect(orders).toEqual([
        {
            "id": expect.any(Number),
            "products": [
                "W0000947",
                "DZ347374"
            ],
            "total": 546.78,
            "shippingAddress": "41 testing road, Test, TE, 12345",
            "orderedOn": expect.any(Date)
        },
        {
            "id": expect.any(Number),
            "products": [
                "PL12281",
                "L008181"
            ],
            "total": 2311.23,
            "shippingAddress": "41 testing road, Test, TE, 12345",
            "orderedOn": expect.any(Date)
        }]);
    });
  
    test("throws NotFoundError if orders cannot be found with username", async function () {
      await expect(Order.get("nonexistentusername")).rejects.toThrowError(NotFoundError);
    });

});

  

  