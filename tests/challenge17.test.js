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

  test("Challenge 17.a - Get paginated search results without a keyword", async () => {
    const userId = 1;
    const res1 = await authenticatedSession
      .post(`/api/friends/${userId}/search`)
      .send({
        keyword: "",
        page: 1,
      });
    const parsedResponse1 = JSON.parse(res1.text);
    const expected1 = [
      {
        id: 2,
        email: "jhalpert@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/7/7e/Jim-halpert.jpg",
        firstname: "Jim",
        lastname: "Halpert",
        sender_id: 1,
        recipient_id: 2,
        status: "PENDING",
        reqId: 1,
      },
      {
        id: 3,
        email: "pbeesly@office.com",
        gender: "Female",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/6/67/Pam_Beesley.jpg",
        firstname: "Pam",
        lastname: "Beesly",
        sender_id: null,
        recipient_id: null,
        status: null,
        reqId: null,
      },
      {
        id: 4,
        email: "dschrute@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/c/cd/Dwight_Schrute.jpg",
        firstname: "Dwight",
        lastname: "Schrute",
        sender_id: 4,
        recipient_id: 1,
        status: "PENDING",
        reqId: 3,
      },
    ];
    expect(parsedResponse1.response).toEqual(expected1);
    expect(res1.status).toBe(200);

    const res2 = await authenticatedSession
      .post(`/api/friends/${userId}/search`)
      .send({
        keyword: "",
        page: 2,
      });
    const parsedResponse2 = JSON.parse(res2.text);
    const expected2 = [
      {
        id: 5,
        email: "ehannon@office.com",
        gender: "Female",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/9/93/Erin_Hannon.jpg",
        firstname: "Erin",
        lastname: "Hannon",
        sender_id: null,
        recipient_id: null,
        status: null,
        reqId: null,
      },
      {
        id: 6,
        email: "rhoward@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/9/91/Ryan_Howard_%28The_Office%29.jpg",
        firstname: "Ryan",
        lastname: "Howard",
        sender_id: null,
        recipient_id: null,
        status: null,
        reqId: null,
      },
      {
        id: 7,
        email: "abernard@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/8/84/Andy_Bernard_photoshot.jpg",
        firstname: "Andy",
        lastname: "Bernard",
        sender_id: null,
        recipient_id: null,
        status: null,
        reqId: null,
      },
    ];
    expect(parsedResponse2.response).toEqual(expected2);
    expect(res2.status).toBe(200);
  });

  test("Challenge 17.b - Get paginated search results with a keyword", async () => {
    const userId = 1;
    const res1 = await authenticatedSession
      .post(`/api/friends/${userId}/search`)
      .send({
        keyword: "Java",
        page: 1,
      });
    const parsedResponse1 = JSON.parse(res1.text);
    const expected1 = [
      {
        id: 2,
        email: "jhalpert@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/7/7e/Jim-halpert.jpg",
        firstname: "Jim",
        lastname: "Halpert",
        sender_id: 1,
        recipient_id: 2,
        status: "PENDING",
        reqId: 1,
      },
      {
        id: 3,
        email: "pbeesly@office.com",
        gender: "Female",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/6/67/Pam_Beesley.jpg",
        firstname: "Pam",
        lastname: "Beesly",
        sender_id: null,
        recipient_id: null,
        status: null,
        reqId: null,
      },
      {
        id: 6,
        email: "rhoward@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/9/91/Ryan_Howard_%28The_Office%29.jpg",
        firstname: "Ryan",
        lastname: "Howard",
        sender_id: null,
        recipient_id: null,
        status: null,
        reqId: null,
      },
    ];
    expect(parsedResponse1.response).toEqual(expected1);
    expect(res1.status).toBe(200);

    const res2 = await authenticatedSession
      .post(`/api/friends/${userId}/search`)
      .send({
        keyword: "Ji",
        page: 1,
      });
    const parsedResponse2 = JSON.parse(res2.text);
    const expected2 = [
      {
        id: 2,
        email: "jhalpert@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/7/7e/Jim-halpert.jpg",
        firstname: "Jim",
        lastname: "Halpert",
        sender_id: 1,
        recipient_id: 2,
        status: "PENDING",
        reqId: 1,
      },
    ];
    expect(parsedResponse2.response).toEqual(expected2);
    expect(res2.status).toBe(200);

    const res3 = await authenticatedSession
      .post(`/api/friends/${userId}/search`)
      .send({
        keyword: "Video",
        page: 1,
      });
    const parsedResponse3 = JSON.parse(res3.text);
    const expected3 = [
      {
        id: 2,
        email: "jhalpert@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/7/7e/Jim-halpert.jpg",
        firstname: "Jim",
        lastname: "Halpert",
        sender_id: 1,
        recipient_id: 2,
        status: "PENDING",
        reqId: 1,
      },
      {
        id: 4,
        email: "dschrute@office.com",
        gender: "Male",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/c/cd/Dwight_Schrute.jpg",
        firstname: "Dwight",
        lastname: "Schrute",
        sender_id: 4,
        recipient_id: 1,
        status: "PENDING",
        reqId: 3,
      },
      {
        id: 5,
        email: "ehannon@office.com",
        gender: "Female",
        image_url:
          "https://upload.wikimedia.org/wikipedia/en/9/93/Erin_Hannon.jpg",
        firstname: "Erin",
        lastname: "Hannon",
        sender_id: null,
        recipient_id: null,
        status: null,
        reqId: null,
      },
    ];

    expect(parsedResponse3.response).toEqual(expected3);
    expect(res3.status).toBe(200);
  });
});
