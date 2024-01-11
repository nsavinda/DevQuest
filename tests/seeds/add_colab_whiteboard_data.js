/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex("colab_whiteboard").del();
    await knex("colab_whiteboard").insert([
        { id: 1, whiteboard_json: "{}", group_id: 1, user_id: 1 },
        { id: 2, whiteboard_json: "{}", group_id: 2, user_id: 3 },
    ]);
}
