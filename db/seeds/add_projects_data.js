/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("projects").del();
  await knex("projects").insert([
    {
      id: 1,
      name: "Football World Cup Project",
      description:
        "This is a project to host the football world cup in an island",
      ownerId: "4",
      createdDate: "2023-07-10",
      dueDate: "2024-07-10",
      projectStatus: "To-Do",
      groupId: "1",
    },
    {
      id: 2,
      name: "Learn to Rap",
      description: "This project is to guide people on how to start rapping",
      ownerId: "4",
      createdDate: "2023-07-08",
      dueDate: "2023-10-10",
      projectStatus: "In-Progress",
      groupId: "3",
    },
    {
      id: 3,
      name: "Street Skateboarding",
      description:
        "This project is to improve street skate boarding and bring it to life",
      ownerId: "4",
      createdDate: "2023-06-23",
      dueDate: "2023-12-23",
      projectStatus: "To-Do",
      groupId: "2",
    },
    {
      id: 4,
      name: "BPL Fantasy League",
      description:
        "This project is to oragnize a fantasy league competition for BPL fans",
      ownerId: "4",
      createdDate: "2023-05-18",
      dueDate: "2023-07-10",
      projectStatus: "In-Progress",
      groupId: "1",
    },
    {
      id: 5,
      name: "Lionel Messi Project",
      description: "This project is to increase the fan base of Lionel Messi",
      ownerId: "6",
      createdDate: "2023-05-18",
      dueDate: "2023-07-10",
      projectStatus: "Done",
      groupId: "1",
    },
    {
      id: 6,
      name: "Skateboard Academy",
      description:
        "This project is to help skateboarding beginners enhance their skills",
      ownerId: "6",
      createdDate: "2023-05-18",
      dueDate: "2023-07-10",
      projectStatus: "In-Progress",
      groupId: "2",
    },
    {
      id: 7,
      name: "LaLiga Project",
      description: "This project is about LaLiga football",
      ownerId: "6",
      createdDate: "2023-05-18",
      dueDate: "2023-07-10",
      projectStatus: "In-Progress",
      groupId: "1",
    },
    {
      id: 8,
      name: "Pro Skateboarding",
      description: "This project is to find pro skateboarders",
      ownerId: "6",
      createdDate: "2023-05-18",
      dueDate: "2023-07-10",
      projectStatus: "Done",
      groupId: "2",
    },
    {
      id: 9,
      name: "PSG Project",
      description: "This project is to increase the fan base of PSG",
      ownerId: "6",
      createdDate: "2023-05-18",
      dueDate: "2023-07-10",
      projectStatus: "To-Do",
      groupId: "1",
    },
    {
      id: 10,
      name: "Skateboard Championship",
      description:
        "This is to find skaters for the skateboard championship",
      ownerId: "6",
      createdDate: "2023-05-18",
      dueDate: "2023-07-10",
      projectStatus: "To-Do",
      groupId: "2",
    },
  ]);
}
