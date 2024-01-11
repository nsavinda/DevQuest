import Hobbies from "../../src/enums/hobbiesEnum.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('groups').del()
  await knex('groups').insert([
    {id: 1, name: 'Football Fans', description: 'A group for passionate football enthusiasts from around the world.', hobbies: `["${Hobbies.SOCCER}"]`, capacity: 7},
    {id: 2, name: 'Skateboarding', description: 'Connect with skaters from all skill levels and backgrounds.', hobbies: `["${Hobbies.SKATEBOARDING}"]`, capacity: 100},
    {id: 3, name: 'RAP WORLD', description: 'Be part of a community where rap is celebrated, elevated, and given the spotlight it deserves!', hobbies: `["${Hobbies.RAP}"]`, capacity: 77}
  ]);
}