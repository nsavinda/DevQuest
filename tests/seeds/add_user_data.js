import bcrypt from "bcrypt";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("hobbies").del();
  await knex("skills").del();

  await knex("users").insert([
    {
      id: 1,
      email: "mscott@office.com",
      password: bcrypt.hashSync("Scott@123", 10),
      gender: "Male",
      firstname: "Michael",
      lastname: "Scott",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/d/dc/MichaelScott.png",
    },
    {
      id: 2,
      email: "jhalpert@office.com",
      password: bcrypt.hashSync("Halpert@123", 10),
      gender: "Male",
      firstname: "Jim",
      lastname: "Halpert",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/7/7e/Jim-halpert.jpg",
    },
    {
      id: 3,
      email: "pbeesly@office.com",
      password: bcrypt.hashSync("Beesly@123", 10),
      gender: "Female",
      firstname: "Pam",
      lastname: "Beesly",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/6/67/Pam_Beesley.jpg",
    },
    {
      id: 4,
      email: "dschrute@office.com",
      password: bcrypt.hashSync("Dwight1234", 10),
      gender: "Male",
      firstname: "Dwight",
      lastname: "Schrute",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/c/cd/Dwight_Schrute.jpg",
    },
    {
      id: 5,
      email: "ehannon@office.com",
      password: bcrypt.hashSync("Erin@123", 10),
      gender: "Female",
      firstname: "Erin",
      lastname: "Hannon",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/9/93/Erin_Hannon.jpg",
    },
    {
      id: 6,
      email: "rhoward@office.com",
      password: bcrypt.hashSync("Ryan@1234", 10),
      gender: "Male",
      firstname: "Ryan",
      lastname: "Howard",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/9/91/Ryan_Howard_%28The_Office%29.jpg",
    },
    {
      id: 7,
      email: "abernard@office.com",
      password: bcrypt.hashSync("Andy@123", 10),
      gender: "Male",
      firstname: "Andy",
      lastname: "Bernard",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/8/84/Andy_Bernard_photoshot.jpg",
    },
    {
      id: 8,
      email: "rcalifornia@office.com",
      password: bcrypt.hashSync("Robert@1234", 10),
      gender: "Male",
      firstname: "Robert",
      lastname: "California",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/b/b1/James-spader-as-robert-california-in-the-office.jpg",
    },
    {
      id: 9,
      email: "kmalone@office.com",
      password: bcrypt.hashSync("Kevin@123", 10),
      gender: "Male",
      firstname: "Kevin",
      lastname: "Malone",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/6/60/Office-1200-baumgartner1.jpg",
    },
    {
      id: 10,
      email: "amartin@office.com",
      password: bcrypt.hashSync("Angela@123", 10),
      gender: "Female",
      firstname: "Angela",
      lastname: "Martin",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/0/0b/Angela_Martin.jpg",
    },
    {
      id: 11,
      email: "omartinez@office.com",
      password: bcrypt.hashSync("Oscar@123", 10),
      gender: "Male",
      firstname: "Oscar",
      lastname: "Martinez",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/5/54/Oscar_Martinez_of_The_Office.jpg",
    },
    {
      id: 12,
      email: "jlevinson@office.com",
      password: bcrypt.hashSync("Jan@123", 10),
      gender: "Female",
      firstname: "Jan",
      lastname: "Levinson",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/d/d1/Melora_Hardin_as_Jan_Levinson.png",
    },
    {
      id: 13,
      email: "kkapoor@office.com",
      password: bcrypt.hashSync("Kelly@123", 10),
      gender: "Female",
      firstname: "Kelly",
      lastname: "Kapoor",
      image_url:
        "https://upload.wikimedia.org/wikipedia/en/6/69/Kelly_Kapoor.jpg",
    },
  ]);

  const hobbies = [
    { id: 1, userId: 1, name: "Soccer", rate: 5 },
    { id: 2, userId: 1, name: "Gym", rate: 4 },
    { id: 3, userId: 1, name: "Sports", rate: 3 },
    { id: 4, userId: 2, name: "Soccer", rate: 5 },
    { id: 5, userId: 2, name: "Music", rate: 1 },
    { id: 6, userId: 2, name: "Video Games", rate: 2 },
    { id: 7, userId: 3, name: "Music", rate: 5 },
    { id: 8, userId: 4, name: "Video Games", rate: 5 },
    { id: 9, userId: 4, name: "Gym", rate: 5 },
    { id: 10, userId: 4, name: "Sports", rate: 3 },
    { id: 11, userId: 4, name: "Rap", rate: 2 },
    { id: 12, userId: 5, name: "Video Games", rate: 1 },
    { id: 13, userId: 5, name: "Gym", rate: 5 },
    { id: 14, userId: 5, name: "Rap", rate: 5 },
    { id: 15, userId: 6, name: "Soccer", rate: 4 },
    { id: 16, userId: 6, name: "Coding", rate: 5 },
    { id: 17, userId: 6, name: "Music", rate: 3 },
    { id: 18, userId: 7, name: "Hiking", rate: 4 },
    { id: 19, userId: 7, name: "Painting", rate: 3 },
    { id: 20, userId: 8, name: "Cooking", rate: 2 },
    { id: 21, userId: 8, name: "Traveling", rate: 4 },
    { id: 22, userId: 8, name: "Painting", rate: 5 },
    { id: 23, userId: 9, name: "Gym", rate: 2 },
    { id: 24, userId: 10, name: "Chess", rate: 4 },
    { id: 25, userId: 11, name: "Traveling", rate: 5 },
    { id: 26, userId: 11, name: "Cooking", rate: 3 },
    { id: 27, userId: 12, name: "Hiking", rate: 4 },
    { id: 28, userId: 13, name: "Chess", rate: 5 },
    { id: 29, userId: 13, name: "Rap", rate: 4 },
    { id: 30, userId: 13, name: "Sports", rate: 3 },
  ];

  const skills = [
    { id: 1, userId: 1, name: "Java", rate: 5 },
    { id: 2, userId: 1, name: "C++", rate: 4 },
    { id: 3, userId: 1, name: "Python", rate: 3 },
    { id: 4, userId: 2, name: "Javascript", rate: 5 },
    { id: 5, userId: 2, name: "Photography", rate: 4 },
    { id: 6, userId: 3, name: "Java", rate: 2 },
    { id: 7, userId: 4, name: "Singing", rate: 5 },
    { id: 8, userId: 4, name: "Ruby", rate: 4 },
    { id: 9, userId: 5, name: "Dancing", rate: 3 },
    { id: 10, userId: 5, name: "Docker", rate: 5 },
    { id: 11, userId: 6, name: "Javascript", rate: 4 },
    { id: 12, userId: 6, name: "Photography", rate: 3 },
    { id: 13, userId: 6, name: "Java", rate: 3 },
    { id: 14, userId: 7, name: "Go", rate: 4 },
    { id: 15, userId: 7, name: "Python", rate: 3 },
    { id: 16, userId: 8, name: "Singing", rate: 5 },
    { id: 17, userId: 8, name: "Photography", rate: 4 },
    { id: 18, userId: 9, name: "Kubernetes", rate: 3 },
    { id: 19, userId: 9, name: "AWS", rate: 4 },
    { id: 20, userId: 9, name: "Dancing", rate: 5 },
    { id: 21, userId: 10, name: "AWS", rate: 4 },
    { id: 22, userId: 10, name: "Docker", rate: 3 },
    { id: 23, userId: 11, name: "Azure", rate: 5 },
    { id: 24, userId: 11, name: "C++", rate: 4 },
    { id: 25, userId: 12, name: "Python", rate: 3 },
    { id: 26, userId: 12, name: "Go", rate: 5 },
    { id: 27, userId: 12, name: "Docker", rate: 4 },
    { id: 28, userId: 13, name: "Azure", rate: 3 },
    { id: 29, userId: 13, name: "Kubernetes", rate: 4 },
  ];

  await knex("hobbies").insert(hobbies);
  await knex("skills").insert(skills);
}