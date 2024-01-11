
import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
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

  test("Challenge 16.a - Remove a friend successfully", async () => {
    const reqId = 2;
    const res = await authenticatedSession.delete(`/api/friends/${reqId}/remove-friend`);
    expect(res.text.includes("Friend removed successfully!")).toBe(true);
    expect(res.status).toBe(200);
    let row = await db.from("friends").where("id", reqId);
    expect(row.length).toBe(0);
  });

  test("Challenge 16.b - Attempting to remove non-friends", async () => {
    const reqId = 3;
    const res = await authenticatedSession.delete(`/api/friends/${reqId}/remove-friend`);
    expect(res.text.includes("Friend not found!")).toBe(true);
  }); 

  test("Challenge 16.c - Cancel a friend request", async () => {
    const reqId = 1;
    const res = await authenticatedSession.delete(`/api/friends/${reqId}/cancel-request`);
    expect(res.text.includes("Request cancelled successfully!")).toBe(true);
    expect(res.status).toBe(200);
    let row = await db.from("friends").where("id", reqId);
    expect(row.length).toBe(0);
  });

  test("Challenge 16.d - Attempting to cancel a non-pending request", async () => {
    const reqId = 2;
    const res = await authenticatedSession.delete(`/api/friends/${reqId}/cancel-request`);
    expect(res.text.includes("Request not found!")).toBe(true);
  });
});
