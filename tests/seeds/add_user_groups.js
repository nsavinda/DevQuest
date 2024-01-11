/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('userGroups').del()
  await knex('userGroups').insert([
    {id: 1, user_id: 4, group_id: 1},
    {id: 2, user_id: 4, group_id: 2},
    {id: 3, user_id: 4, group_id: 3},
    {id: 4, user_id: 1, group_id: 1},
    {id: 5, user_id: 1, group_id: 2},
    {id: 6, user_id: 1, group_id: 3},
    {id: 7, user_id: 6, group_id: 1},
    {id: 8, user_id: 6, group_id: 2},
  ]);
}
