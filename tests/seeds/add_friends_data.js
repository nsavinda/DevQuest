import FriendshipStatus from "../../src/enums/friendshipStatus.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("friends").del();
  await knex("friends").insert([
    { id: 1, sender_id: 1, recipient_id: 2, status: FriendshipStatus.PENDING },
    { id: 2, sender_id: 6, recipient_id: 3, status: FriendshipStatus.ACCEPTED },
    { id: 3, sender_id: 4, recipient_id: 1, status: FriendshipStatus.PENDING },
    { id: 4, sender_id: 5, recipient_id: 6, status: FriendshipStatus.PENDING },
    { id: 5, sender_id: 7, recipient_id: 8, status: FriendshipStatus.ACCEPTED },
    { id: 6, sender_id: 8, recipient_id: 9, status: FriendshipStatus.ACCEPTED},
    { id: 7, sender_id: 11, recipient_id: 8, status: FriendshipStatus.ACCEPTED},
    { id: 8, sender_id: 4, recipient_id: 5, status: FriendshipStatus.ACCEPTED},
    { id: 9, sender_id: 10, recipient_id: 11, status: FriendshipStatus.ACCEPTED},
    { id: 10, sender_id: 11, recipient_id: 12, status: FriendshipStatus.ACCEPTED},
    { id: 11, sender_id: 11, recipient_id: 13, status: FriendshipStatus.PENDING},
    { id: 12, sender_id: 12, recipient_id: 13, status: FriendshipStatus.ACCEPTED},
  ]);
}
