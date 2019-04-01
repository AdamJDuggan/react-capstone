"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/react-test-db";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/react-test-db";
exports.PORT = process.env.PORT || 5000;
exports.secretOrKey = 'secret'