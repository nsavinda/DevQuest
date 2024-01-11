

import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import * as fs from "fs";
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

  test("Challenge 8 - Get the relevent groups of user", async () => {
    const res = await authenticatedSession.get(
      `/api/groups/${authenticatedUserId}/userGroups`
    );
    const userGroupsCount = JSON.parse(res.text).response.length;

    expect(res.status).toBe(200);
    
    const userGroups = await db
      .from("userGroups")
      .select("*")
      .where("user_id", authenticatedUserId);

    expect(userGroupsCount).toBe(userGroups.length);
  });
});
