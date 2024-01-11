/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex("groups").del();
    await knex("groups").insert([
        { id: 1, name: "Football", description: "A group for football", hobbies: ["Football"], capacity: 11 },
        { id: 2, name: "Volleyball", description: "A group for volleyball", hobbies: ["Volleyball"], capacity: 6 },
        { id: 3, name: "Baseball", description: "A group for baseball", hobbies: ["Baseball"], capacity: 12 },
    ]);
}
