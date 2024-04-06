"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

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

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/users/testuser`)
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.body).toEqual({
      user: {
        username: "testuser",
        firstName: "Test",
        lastName: "Test",
        email: "test@test.com",
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/users/testuser`)
      .set("authorization", `Bearer ${test2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/users/testuser`);

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for same user", async function () {
    const resp = await request(app)
      .patch(`/users/testuser`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.body).toEqual({
      user: {
        username: "testuser",
        firstName: "New",
        lastName: "Test",
        email: "test@test.com",
      },
    });
  });

  test("works: can set new password", async function () {
      const resp = await request(app)
        .patch(`/users/testuser`)
        .send({
          password: "new-password",
        })
        .set("authorization", `Bearer ${testToken}`);

      expect(resp.body).toEqual({
        user: {
          username: "testuser",
          firstName: "Test",
          lastName: "Test",
          email: "test@test.com",
        },
      });
      
      const isSuccessful = await User.authenticate("testuser", "new-password");
      expect(isSuccessful).toBeTruthy();
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .patch(`/users/testuser`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${test2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/users/testuser`)
      .send({
        firstName: "New",
      });

    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/users/testuser`)
      .send({
        firstName: 2332,
      })
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.statusCode).toEqual(400);
  }); 
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .delete(`/users/testuser`)
      .set("authorization", `Bearer ${testToken}`);

    expect(resp.body).toEqual({ deleted: "testuser" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .delete(`/users/testuser`)
      .set("authorization", `Bearer ${test2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .delete(`/users/testuser`);

    expect(resp.statusCode).toEqual(401);
  });
});

