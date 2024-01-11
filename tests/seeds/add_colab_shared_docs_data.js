/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex("colab_shared_docs").del();
    await knex("colab_shared_docs").insert([
        { id: 1, file_name: "test.txt", file_desc: "This is a test description", file_path: "/fakepath", group_id: 1, user_id: 1 },
        { id: 2, file_name: "another_test.txt", file_desc: "This is a test description", file_path: "/fakepath2", group_id: 1, user_id: 1 },
        { id: 3, file_name: "another_test2.txt", file_desc: "This is a test description", file_path: "/fakepath3", group_id: 1, user_id: 1 },
    ]);
}
