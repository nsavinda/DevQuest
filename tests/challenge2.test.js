
import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
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
  test("Challenge 2.a - Return suggestions based on hobbies", async () => {
    const userId1 = 6;
    const suggestedFriends1 = await authenticatedSession.get(
      `/api/friends/${userId1}/suggestions`
    );

    const parsedResponse1 = JSON.parse(suggestedFriends1.text);
    const responseArray1 = parsedResponse1.response;
    const expectedSuggestions1 = [
      {
        id: 1,
        email: "mscott@office.com",
        firstname: "Michael",
        gender: "Male",
        lastname: "Scott",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/d/dc/MichaelScott.png",
        hobbies: [
          {
            name: "Gym",
            rate: 4,
          },
          {
            name: "Soccer",
            rate: 5,
          },
          {
            name: "Sports",
            rate: 3,
          },
        ],
        skills: [
          {
            name: "C++",
            rate: 4,
          },
          {
            name: "Java",
            rate: 5,
          },
          {
            name: "Python",
            rate: 3,
          },
        ],
      },
      {
        id: 2,
        email: "jhalpert@office.com",
        firstname: "Jim",
        gender: "Male",
        lastname: "Halpert",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/7/7e/Jim-halpert.jpg",
        hobbies: [
          {
            name: "Music",
            rate: 1,
          },
          {
            name: "Soccer",
            rate: 5,
          },
          {
            name: "Video Games",
            rate: 2,
          },
        ],
        skills: [
          {
            name: "Javascript",
            rate: 5,
          },
          {
            name: "Photography",
            rate: 4,
          },
        ],
      },
    ];
    expect(responseArray1).toEqual(expectedSuggestions1);

    const userId2 = 3;
    const suggestedFriends2 = await authenticatedSession.get(
      `/api/friends/${userId2}/suggestions`
    );

    const parsedResponse2 = JSON.parse(suggestedFriends2.text);
    const responseArray2 = parsedResponse2.response;
    const expectedSuggestions2 = [
      {
        id: 2,
        email: "jhalpert@office.com",
        firstname: "Jim",
        gender: "Male",
        lastname: "Halpert",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/7/7e/Jim-halpert.jpg",
        hobbies: [
          {
            name: "Music",
            rate: 1,
          },
          {
            name: "Soccer",
            rate: 5,
          },
          {
            name: "Video Games",
            rate: 2,
          },
        ],
        skills: [
          {
            name: "Javascript",
            rate: 5,
          },
          {
            name: "Photography",
            rate: 4,
          },
        ],
      },
    ];
    expect(responseArray2).toEqual(expectedSuggestions2);
  });
});
