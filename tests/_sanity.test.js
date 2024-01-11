

import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
import bcrypt from "bcrypt";
import { expect,test,describe,beforeAll,afterAll,afterEach } from "vitest";
var testSession = null;

/**
 * Create a super test session and initiate the database before running tests.
 */
beforeAll(async () => {
  testSession = testBase.createSuperTestSession(app);
  await testBase.resetDatabase(db);
});

/**
 * Reset the database after every test case
 */
afterEach(async () => {
  await testBase.resetDatabase(db);
});

/**
 * Take down the app once test execution is done
 */
afterAll((done) => {
  app.close(done);
});

describe("Pre authentication tasks", () => {
  test("Sanity Test - Login page works", async () => {
    const res = await testSession.post("/api/auth/login").send({
      email: "rhoward@office.com",
      password: "Ryan@1234",
    });
    expect(res.status).toBe(200);
  });

  test("Sanity Test - New user registration works", async () => {
    const res = await testSession.post("/api/auth/signup").send({
      id: 7,
      email: "abc@99x.io",
      password: bcrypt.hashSync("abc123", 10),
      gender: "Male",
      firstname: "ABC",
      lastname: "123",
      hobbies: [
        {
          name: "Cricket",
          rate: 3,
        },
        {
          name: "Singing",
          rate: 2,
        },
      ],
      skills: [
        {
          name: "Dancing",
          rate: 3,
        },
        {
          name: "Coding",
          rate: 5,
        },
      ],
      image_url:
        "https://pbs.twimg.com/media/EK-YsU9XYAU7R-o?format=jpg&name=medium",
    });
    expect(res.status).toBe(200);
    const users = await db.from("users").select("email");
    expect(users.length).toBe(14);
  });

  test("Sanity Test - Database reset for each test", async () => {
    const users = await db.from("users").select("email");
    expect(users.length).toBe(13);
  });
});
