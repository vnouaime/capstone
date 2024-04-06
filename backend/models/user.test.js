"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
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

/************************************** authenticate */

describe("authenticate", function () {
    test("works", async function () {
        const user = await User.authenticate("testuser", "password1");

        expect(user).toEqual({
            username: "testuser",
            firstName: "Test",
            lastName: "Test",
            email: "test@email.com"
        });
    });

    test("unauth if no such user", async function () {
        try {
        await User.authenticate("nonexistentuser", "password");
        fail();
        } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    test("unauth if wrong password", async function () {
        try {
        await User.authenticate("testuser", "wrongpassword");
        fail();
        } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });
});

/************************************** register */

describe("register", function () {
    const newUser = {
        username: "new",
        firstName: "Test",
        lastName: "Tester",
        email: "test@test.com"
    };

    test("works", async function () {
        let user = await User.register({
        ...newUser,
        password: "password",
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'new'");

        expect(user).toEqual(newUser);
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("bad request with dup data", async function () {
        try {
        await User.register({
            ...newUser,
            password: "password",
        });
        await User.register({
            ...newUser,
            password: "password",
        });
        fail();
        } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

// /************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("testuser");

    expect(user).toEqual({
        username: "testuser",
        firstName: "Test",
        lastName: "Test",
        email: "test@email.com"
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nonexistentuser");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

describe("update", function () {
    const updateData = {
        firstName: "NewF",
        lastName: "NewL",
        email: "new@email.com",
    };

    test("works", async function () {
        let user = await User.update("testuser", updateData);
        expect(user).toEqual({
        username: "testuser",
        ...updateData,
        });
    });

    test("works: set password", async function () {
        let job = await User.update("testuser", {
          password: "new",
        });

        expect(job).toEqual({
          username: "testuser",
          firstName: "Test",
          lastName: "Test",
          email: "test@email.com",
        });

        const found = await db.query("SELECT * FROM users WHERE username = 'testuser'");

        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("not found if no such user", async function () {
        try {
        await User.update("nonexistentuser", {
            firstName: "test",
        });
        fail();
        } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request if no data", async function () {
        try {
        await User.update("testuser", {});
        fail();
        } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

// /************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await User.remove("testuser");
        const res = await db.query(
            "SELECT * FROM users WHERE username='testuser'");
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such user", async function () {
        try {
        await User.remove("nonexistentuser");
        fail();
        } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
