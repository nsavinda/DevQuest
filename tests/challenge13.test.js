

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
  test("Challenge 13 - Update a task successfully", async () => {
    let taskId = 8;
    const res = await authenticatedSession.put(`/api/groups/${taskId}/updateTask`).send({
      taskName: 'Test Task Name',
      taskDescription: 'Test Task Description',
      endDate: '2023-09-10',
      assignee: '6'
    });
    expect(res.text.includes("success")).toBe(true);

    const updatedTask = await db
      .from("tasks")
      .select("*")
      .where("id", taskId);

    expect(updatedTask[0].name).toBe('Test Task Name');
  });
});
