

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
  test("Challenge 10 - Add new project to a group successfully", async () => {
    let groupId = 1;
    const res = await authenticatedSession.post("/api/groups/addNewProject").send({
      projectName: 'New Project',
      projectDescription: 'New Project Description',
      currentDate: '2023-07-26',
      endDate: '2023-08-04',
      userId: '6',
      seletedUserGroupId: groupId,
      status: 'To-Do'
    });
    expect(res.text.includes("success")).toBe(true);

    const res2 = await authenticatedSession.get(`/api/groups/${groupId}/groupProjects`);    
    const groupProjectsCount = JSON.parse(res2.text).response.length;

    const groupProjects = await db
      .from("projects")
      .select("*")
      .where("groupId", groupId);

    expect(groupProjectsCount).toBe(groupProjects.length);
  });

});
