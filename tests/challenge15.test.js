

import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import * as fs from 'fs';
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
  test("Challenge 15 - Update task status successfully", async () => {
    let taskStatus = "Done";
    let taskId = 13;
    const res = await authenticatedSession.put(`/api/groups/${taskId}/updateTaskStatus`).send({
      status: taskStatus,
    });
    expect(res.text.includes("success")).toBe(true);

    const updatedTask = await db
      .from("tasks")
      .select("*")
      .where("id", taskId);

    expect(updatedTask[0].taskStatus).toBe(taskStatus);
  });
});
