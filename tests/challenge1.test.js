

import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
import bcrypt from "bcrypt";
import { expect,test,describe,beforeAll,afterAll,afterEach } from "vitest";
var testSession = null;
const users = [
  {
    id: 1,
    email: "mscott@office.com",
    gender: "Male",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/MichaelScott.png",
    firstname: "Michael",
    lastname: "Scott",
    hobbies: [
      { name: "Gym", rate: 4 },
      { name: "Soccer", rate: 5 },
      { name: "Sports", rate: 3 },
    ],
    skills: [
      { name: "C++", rate: 4 },
      { name: "Java", rate: 5 },
      { name: "Python", rate: 3 },
    ],
  },
  {
    id: 2,
    email: "jhalpert@office.com",
    gender: "Male",
    image_url: "https://upload.wikimedia.org/wikipedia/en/7/7e/Jim-halpert.jpg",
    firstname: "Jim",
    lastname: "Halpert",
    hobbies: [
      { name: "Music", rate: 1 },
      { name: "Soccer", rate: 5 },
      { name: "Video Games", rate: 2 },
    ],
    skills: [
      { name: "Javascript", rate: 5 },
      { name: "Photography", rate: 4 },
    ],
  },
  {
    id: 3,
    email: "pbeesly@office.com",
    gender: "Female",
    image_url: "https://upload.wikimedia.org/wikipedia/en/6/67/Pam_Beesley.jpg",
    firstname: "Pam",
    lastname: "Beesly",
    hobbies: [{ name: "Music", rate: 5 }],
    skills: [{ name: "Java", rate: 2 }],
  },
  {
    id: 4,
    email: "dschrute@office.com",
    gender: "Male",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/c/cd/Dwight_Schrute.jpg",
    firstname: "Dwight",
    lastname: "Schrute",
    hobbies: [
      { name: "Gym", rate: 5 },
      { name: "Rap", rate: 2 },
      { name: "Sports", rate: 3 },
      { name: "Video Games", rate: 5 },
    ],
    skills: [
      { name: "Ruby", rate: 4 },
      { name: "Singing", rate: 5 },
    ],
  },
  {
    id: 5,
    email: "ehannon@office.com",
    gender: "Female",
    image_url: "https://upload.wikimedia.org/wikipedia/en/9/93/Erin_Hannon.jpg",
    firstname: "Erin",
    lastname: "Hannon",
    hobbies: [
      { name: "Gym", rate: 5 },
      { name: "Rap", rate: 5 },
      { name: "Video Games", rate: 1 },
    ],
    skills: [
      { name: "Dancing", rate: 3 },
      { name: "Docker", rate: 5 },
    ],
  },
  {
    id: 6,
    email: "rhoward@office.com",
    gender: "Male",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/9/91/Ryan_Howard_%28The_Office%29.jpg",
    firstname: "Ryan",
    lastname: "Howard",
    hobbies: [
      { name: "Coding", rate: 5 },
      { name: "Music", rate: 3 },
      { name: "Soccer", rate: 4 },
    ],
    skills: [
      { name: "Java", rate: 3 },
      { name: "Javascript", rate: 4 },
      { name: "Photography", rate: 3 },
    ],
  },
  {
    id: 7,
    email: "abernard@office.com",
    gender: "Male",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/8/84/Andy_Bernard_photoshot.jpg",
    firstname: "Andy",
    lastname: "Bernard",
    hobbies: [
      { name: "Hiking", rate: 4 },
      { name: "Painting", rate: 3 },
    ],
    skills: [
      { name: "Go", rate: 4 },
      { name: "Python", rate: 3 },
    ],
  },
  {
    id: 8,
    email: "rcalifornia@office.com",
    gender: "Male",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/b/b1/James-spader-as-robert-california-in-the-office.jpg",
    firstname: "Robert",
    lastname: "California",
    hobbies: [
      { name: "Cooking", rate: 2 },
      { name: "Painting", rate: 5 },
      { name: "Traveling", rate: 4 },
    ],
    skills: [
      { name: "Photography", rate: 4 },
      { name: "Singing", rate: 5 },
    ],
  },
  {
    id: 9,
    email: "kmalone@office.com",
    gender: "Male",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/6/60/Office-1200-baumgartner1.jpg",
    firstname: "Kevin",
    lastname: "Malone",
    hobbies: [{ name: "Gym", rate: 2 }],
    skills: [
      { name: "AWS", rate: 4 },
      { name: "Dancing", rate: 5 },
      { name: "Kubernetes", rate: 3 },
    ],
  },
  {
    id: 10,
    email: "amartin@office.com",
    gender: "Female",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/0/0b/Angela_Martin.jpg",
    firstname: "Angela",
    lastname: "Martin",
    hobbies: [{ name: "Chess", rate: 4 }],
    skills: [
      { name: "AWS", rate: 4 },
      { name: "Docker", rate: 3 },
    ],
  },
  {
    id: 11,
    email: "omartinez@office.com",
    gender: "Male",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/5/54/Oscar_Martinez_of_The_Office.jpg",
    firstname: "Oscar",
    lastname: "Martinez",
    hobbies: [
      { name: "Cooking", rate: 3 },
      { name: "Traveling", rate: 5 },
    ],
    skills: [
      { name: "Azure", rate: 5 },
      { name: "C++", rate: 4 },
    ],
  },
  {
    id: 12,
    email: "jlevinson@office.com",
    gender: "Female",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/d/d1/Melora_Hardin_as_Jan_Levinson.png",
    firstname: "Jan",
    lastname: "Levinson",
    hobbies: [{ name: "Hiking", rate: 4 }],
    skills: [
      { name: "Docker", rate: 4 },
      { name: "Go", rate: 5 },
      { name: "Python", rate: 3 },
    ],
  },
  {
    id: 13,
    email: "kkapoor@office.com",
    gender: "Female",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/6/69/Kelly_Kapoor.jpg",
    firstname: "Kelly",
    lastname: "Kapoor",
    hobbies: [
      { name: "Chess", rate: 5 },
      { name: "Rap", rate: 4 },
      { name: "Sports", rate: 3 },
    ],
    skills: [
      { name: "Azure", rate: 3 },
      { name: "Kubernetes", rate: 4 },
    ],
  },
];

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

describe("Post authentication tasks 1.a", () => {
  var authenticatedSession = null;
  var authenticatedUserId = null;
  beforeAll(
    async () =>
      await testBase.authenticateTestSession(testSession).then((userId) => {
        authenticatedSession = testSession;
        authenticatedUserId = userId;
      })
  );

  test("Challenge 1.a - Getting users", async () => {
    const allUsers = await authenticatedSession.get(`/api/users`);

    const parsedResponse = JSON.parse(allUsers.text);
    const responseArray = parsedResponse.response;
    expect(responseArray.length).toEqual(users.length);
    expect(responseArray[1]).toEqual(users[1]);
  });
});

describe("Post authentication tasks 1.b", () => {
  var authenticatedSession = null;
  var authenticatedUserId = null;
  beforeAll(
    async () =>
      await testBase.authenticateTestSession(testSession).then((userId) => {
        authenticatedSession = testSession;
        authenticatedUserId = userId;
      })
  );

  test("Challenge 1.b - User not found! for a non-existing user ID", async () => {
    const userId = 999;
    const result = await authenticatedSession.get(`/api/users/${userId}`);
    expect(result.text.includes("User Not Found")).toBe(true);
  });
});
