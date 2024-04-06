"use strict"

// Shared config for application
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// Have to have server or port 3001 since frontend is on port 3000
const PORT = +process.env.PORT || 3001;
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Depending on env, can use dev or test database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgres:///furnify_test"
      : process.env.DATABASE_URL || "postgres:///furnify";
}

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
}