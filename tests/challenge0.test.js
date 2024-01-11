

import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
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
  test("Challenge 0.a - User not found do not expose too much information", async () => {
    const res = await testSession.post("/api/auth/login").send({
      email: "rhoward12@office.com",
      password: "Ryan@1234",
    });
    expect(res.status).toBe(403);
    expect(res.text.includes("User Not Found")).toBe(false);
    expect(res.text.includes("User authentication failed")).toBe(true);
  });

  test("Challenge 0.b - Wrong password do not expose too much information", async () => {
    const res = await testSession.post("/api/auth/login").send({
      email: "rhoward@office.com",
      password: "Ryan1234",
    });
    expect(res.status).toBe(404);
    expect(res.text.includes("Password Mismatch")).toBe(false);
    expect(res.text.includes("User authentication failed")).toBe(true);
  });
});

describe("Post authentication tasks", () => {
  var authenticatedSession = null;
  var authenticatedUserId = null;
  beforeAll(
    async () =>
      await testBase.authenticateTestSession(testSession).then((userId) => {
        authenticatedSession = testSession;
        authenticatedUserId = userId;
      })
  );

  test("Challenge 0.c - Show user's firstname and lastname in welcome message", async () => {
    let userId = 6;
    const res = await authenticatedSession.get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    const parsedResponse = JSON.parse(res.text);
    const userResponse = parsedResponse.response;
    expect(userResponse).toHaveProperty("firstname");
    expect(userResponse).toHaveProperty("lastname");
  });
});
