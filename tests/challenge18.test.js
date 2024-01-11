import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";
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

  test("Challenge 18 - Get people you may know", async () => {
    const userId1 = 1;
    const res1 = await authenticatedSession.get(
      `/api/friends/${userId1}/people-you-may-know`
    );
    const parsedResponse1 = JSON.parse(res1.text);
    const expected1 = [];
    expect(parsedResponse1.response).toEqual(expected1);
    expect(res1.status).toBe(200);

    const userId2 = 9;
    const res2 = await authenticatedSession.get(
      `/api/friends/${userId2}/people-you-may-know`
    );
    const parsedResponse2 = JSON.parse(res2.text);
    const expected2 = [
      {
        id: 7,
        email: "abernard@office.com",
        firstname: "Andy",
        gender: "Male",
        lastname: "Bernard",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/8/84/Andy_Bernard_photoshot.jpg",
      },
      {
        id: 11,
        email: "omartinez@office.com",
        firstname: "Oscar",
        gender: "Male",
        lastname: "Martinez",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/5/54/Oscar_Martinez_of_The_Office.jpg",
      },
      {
        id: 10,
        email: "amartin@office.com",
        firstname: "Angela",
        gender: "Female",
        lastname: "Martin",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/0/0b/Angela_Martin.jpg",
      },
      {
        id: 12,
        email: "jlevinson@office.com",
        firstname: "Jan",
        gender: "Female",
        lastname: "Levinson",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/d/d1/Melora_Hardin_as_Jan_Levinson.png",
      },
      {
        id: 13,
        email: "kkapoor@office.com",
        firstname: "Kelly",
        gender: "Female",
        lastname: "Kapoor",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/6/69/Kelly_Kapoor.jpg",
      },
    ];
    expect(parsedResponse2.response).toEqual(expected2);
    expect(res2.status).toBe(200);

    const userId3 = 11;
    const res3 = await authenticatedSession.get(
      `/api/friends/${userId3}/people-you-may-know`
    );
    const parsedResponse3 = JSON.parse(res3.text);
    const expected3 = [
      {
        id: 7,
        email: "abernard@office.com",
        firstname: "Andy",
        gender: "Male",
        lastname: "Bernard",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/8/84/Andy_Bernard_photoshot.jpg",
      },
      {
        id: 9,
        email: "kmalone@office.com",
        firstname: "Kevin",
        gender: "Male",
        lastname: "Malone",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/6/60/Office-1200-baumgartner1.jpg",
      }
    ];
    expect(parsedResponse3.response).toEqual(expected3);
    expect(res3.status).toBe(200);
  });
});
