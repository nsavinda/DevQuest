

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
  test("Challenge 12 - Update a project successfully", async () => {
    let projectId = 10;
    const res = await authenticatedSession.put(`/api/groups/${projectId}/updateProject`).send({
      projectName: 'Updated Project Name',
      projectDescription: 'Updated Project Description',
      endDate: '2023-08-04'
    });
    expect(res.text.includes("success")).toBe(true);

    const res2 = await authenticatedSession.get(`/api/groups/${projectId}/project`);    
    const projectUpdatedDetails = JSON.parse(res2.text).response;

    expect(projectUpdatedDetails[0].name).toBe('Updated Project Name');
  });
});
