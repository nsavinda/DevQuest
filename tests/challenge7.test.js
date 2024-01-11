
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

    test("Challenge 7.a - Insert WhiteBoardData into colab_whiteboard table", async () => {
        const res = await authenticatedSession.post("/api/colab/post-whiteboard").send({
            whiteboard_json: "{}", 
            user_id: 3, 
            group_id: 1
          });
        expect(res.status).toBe(200);
        expect(res.text.includes("success")).toBe(true);
    });

    test("Challenge 7.b - Get WhiteBoardData from colab_whiteboard table at DB", async () => {
        await db("colab_whiteboard").insert([
            { whiteboard_json: "{}", group_id: 1, user_id: 3 },
        ]);
        let group_id = 1;
        const result = await authenticatedSession.get(`/api/colab/get-whiteboard/${group_id}`)
        expect(result.status).toBe(200);
        const parsedResponse1 = JSON.parse(result.text);
        const responseArray1 = parsedResponse1.response;
        expect(responseArray1.length).toBe(1);

    });
});
