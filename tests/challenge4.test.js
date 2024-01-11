
import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
import FriendshipStatus from "../src/enums/friendshipStatus.js";
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
  test("Challenge 4.a - Return an array of friends", async () => {
    await db("friends")
      .update({
        sender_id: 5,
        recipient_id: 6,
        status: FriendshipStatus.ACCEPTED,
      })
      .where("id", 4);

    const res1 = await authenticatedSession.get(
      `/api/friends/${authenticatedUserId}`
    );

    expect(res1.status).toBe(200);
    const parsedResponse1 = JSON.parse(res1.text);
    const user1 = parsedResponse1.response;

    expect(user1).toEqual([
      {
        id: 3,
        email: "pbeesly@office.com",
        gender: "Female",
        firstname: "Pam",
        lastname: "Beesly",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/6/67/Pam_Beesley.jpg",
        hobbies: [{ name: "Music", rate: 5 }],
        skills: [{ name: "Java", rate: 2 }],
        reqId: 2
      },
      {
        id: 5,
        email: "ehannon@office.com",
        gender: "Female",
        firstname: "Erin",
        lastname: "Hannon",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/9/93/Erin_Hannon.jpg",
        hobbies: [
          { name: "Video Games", rate: 1 },
          { name: "Gym", rate: 5 },
          { name: "Rap", rate: 5 },
        ],
        skills: [
          { name: "Dancing", rate: 3 },
          { name: "Docker", rate: 5 },
        ],
        reqId: 4
      },
    ]);

    const res2 = await authenticatedSession.get(`/api/friends/3`);

    expect(res2.status).toBe(200);
    const parsedResponse2 = JSON.parse(res2.text);
    const user2 = parsedResponse2.response;

    expect(user2).toEqual([
      {
        id: 6,
        email: "rhoward@office.com",
        gender: "Male",
        firstname: "Ryan",
        lastname: "Howard",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/9/91/Ryan_Howard_%28The_Office%29.jpg",
        hobbies: [
          { name: "Soccer", rate: 4 },
          { name: "Coding", rate: 5 },
          { name: "Music", rate: 3 },
        ],
        skills: [
          { name: "Java", rate: 3 },
          { name: "Javascript", rate: 4 },
          { name: "Photography", rate: 3 },
        ],
        reqId: 2
      },
    ]);
  });
});
