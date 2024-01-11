

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
  test("Challenge 11 - Add new task to a project successfully", async () => {
    let projectId = 4;
    const res = await authenticatedSession.post(`/api/groups/addNewTask`).send({
      name: 'New Task',
      taskDescription: 'New Task Description',
      assignee: '6',
      reporter: '6',
      createdDate: '2023-07-26',
      dueDate: '2023-07-29',
      projectId: projectId,
      taskStatus: 'To-Do'
    });
    expect(res.text.includes("success")).toBe(true);

    const res2 = await authenticatedSession.get(`/api/groups/${projectId}/projectTasks`);    
    const projectTaskCount = JSON.parse(res2.text).response.length;

    const projectTasks = await db
      .from("tasks")
      .select("*")
      .where("projectId", projectId)
      .where("assigneeId", authenticatedUserId);

    expect(projectTaskCount).toBe(projectTasks.length);
  });
});
