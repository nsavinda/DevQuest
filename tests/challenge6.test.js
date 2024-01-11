
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

    test("Challenge 6.a - Insert user into UserGroups table", async () => {
        const res = await authenticatedSession.post("/api/groups/addUserIntoGroup").send({
            user_id: 3, 
            group_id: 1
          });
        expect(res.status).toBe(200);
    });

    test("Challenge 6.b - Retrieve New group into Group table at DB", async () => {
        await db('userGroups').insert(
            {
                user_id: 3, 
                group_id: 1
              });
        let user_id = 3;
        const result = await authenticatedSession.get(`/api/groups/${user_id}`);
        expect(result.status).toBe(200);
        const parsedResponse1 = JSON.parse(result.text);
        const responseArray1 = parsedResponse1.response;
        expect(responseArray1.length).toBe(1);

    });
});
