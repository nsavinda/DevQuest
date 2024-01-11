
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

  test("Challenge 3.a - Send a friend request successfully", async () => {
    const res = await authenticatedSession.post("/api/friends/request").send({
      sender_id: 6,
      recipient_id: 1,
      status: "PENDING",
    });
    let row = await db
      .from("friends")
      .count("* as count")
      .where("sender_id", 6)
      .andWhere("status", "PENDING");
    expect(res.text.includes("success")).toBe(true);
    expect(row[0].count).toBe(1);
  });

  test("Challenge 3.b - Check whether the request was already sent", async () => {
    const res = await authenticatedSession.post("/api/friends/request").send({
      sender_id: 5,
      recipient_id: 6,
      status: "PENDING",
    });
    expect(res.text.includes("Request already sent!")).toBe(true);
  });

  test("Challenge 3.c - Check whether the request was already received", async () => {
    const res = await authenticatedSession.post("/api/friends/request").send({
      sender_id: 6,
      recipient_id: 5,
      status: "PENDING",
    });
    expect(res.text.includes("Request already received!")).toBe(true);
  });

  test("Challenge 3.d - Count the number of friend requests sent", async () => {
    let row1 = await db
      .from("friends")
      .count("* as count")
      .where("sender_id", authenticatedUserId)
      .andWhere("status", "PENDING");
    const sentReqs1 = await authenticatedSession.get(
      `/api/friends/${authenticatedUserId}/sent-requests`
    );

    const parsedResponse1 = JSON.parse(sentReqs1.text);
    const responseArray1 = parsedResponse1.response;
    expect(row1[0].count).toEqual(responseArray1.length);

    const sentReqs2 = await authenticatedSession.get(
      `/api/friends/1/sent-requests`
    );
    const parsedResponse2 = JSON.parse(sentReqs2.text);
    const responseArray2 = parsedResponse2.response;

    let row2 = await db
      .from("friends")
      .count("* as count")
      .where("sender_id", 1)
      .andWhere("status", "PENDING");
    expect(row2[0].count).toEqual(responseArray2.length);
  });

  test("Challenge 3.e - Return an array of pending friend requests", async () => {
    const pendingReqs1 = await authenticatedSession.get(
      `/api/friends/${authenticatedUserId}/received-requests`
    );

    const parsedResponse1 = JSON.parse(pendingReqs1.text);
    const responseArray1 = parsedResponse1.response;

    expect(responseArray1[0]).toEqual({
      id: 5,
      email: "ehannon@office.com",
      gender: "Female",
      firstname: "Erin",
      lastname: "Hannon",

      image_url:
        "https://upload.wikimedia.org/wikipedia/en/9/93/Erin_Hannon.jpg",
      hobbies: [
        {
          name: "Video Games",
          rate: 1,
        },
        {
          name: "Gym",
          rate: 5,
        },
        {
          name: "Rap",
          rate: 5,
        },
      ],
      skills: [
        {
          name: "Dancing",
          rate: 3,
        },
        {
          name: "Docker",
          rate: 5,
        },
      ],
      reqId: 4
    });
  });

  test("Challenge 3.f - Accept a friend request", async () => {
    const reqId = 4;
    const res = await authenticatedSession.put(
      `/api/friends/${reqId}/accept-request`
    );
    expect(res.text.includes("success")).toBe(true);
    let row = await db.from("friends").where("id", reqId);
    expect(row[0].status).toEqual("ACCEPTED");
  });

  test("Challenge 3.g - Reject a friend request", async () => {
    const reqId1 = 4;
    await authenticatedSession.put(`/api/friends/${reqId1}/accept-request`);

    const reqId2 = 3;
    const res = await authenticatedSession.delete(
      `/api/friends/${reqId2}/reject-request`
    );
    expect(res.text.includes("Request deleted successfully!")).toBe(true);
    const friendReqs = await db.from("friends").select("id");
    expect(friendReqs.length).toBe(11);
  });
});
