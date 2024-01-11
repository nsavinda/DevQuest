import knex from "knex";
import knex_db from "../../db/db-config.js";
import userRepository from "./userRepository.js";
import httpStatus from "../enums/httpStatus.js";

let _db;
function init(db) {
  _db = db;
}

//Update this method to complete challenge2.a
async function getSuggestedFriends(userId) {
  try {
    const userHobbies = await knex_db('hobbies').where('userId', userId).select('name', 'rate');
    const otherUsers = await knex_db('hobbies').whereNot('userId', userId).whereIn('name', userHobbies.map(hobby => hobby.name)).select('userId', 'name', 'rate');

    const friends = await knex_db('friends').where('status', 'ACCEPTED').andWhere(function () {
      this.where('sender_id', userId).orWhere('recipient_id', userId);
    });
    const friendIds = friends.map(friend => friend.sender_id == userId ? friend.recipient_id : friend.sender_id);

    let filteredOtherUsers = otherUsers.filter(user => !friendIds.includes(user.userId));
    filteredOtherUsers = filteredOtherUsers.map(user => {
      const userHobby = userHobbies.find(hobby => hobby.name === user.name);
      const rateDifference = Math.abs(userHobby.rate - user.rate);
      return { ...user, rateDifference };
    }).sort((a, b) => a.rateDifference - b.rateDifference);

    const minRateDifference = filteredOtherUsers[0].rateDifference;
    filteredOtherUsers = filteredOtherUsers.filter(user => user.rateDifference === minRateDifference);
    filteredOtherUsers = filteredOtherUsers.slice(0, 5);

    const suggestedFriends = await Promise.all(filteredOtherUsers.map(async user => {
      const userDetails = await userRepository.getUser(user.userId);
      return userDetails;
    }));

    suggestedFriends.forEach(user => {
      user.hobbies.sort((a, b) => a.name.localeCompare(b.name));
    });

    return suggestedFriends;
  } catch (error) {
    console.error("Could not fetch suggested friends:", error);
    return [];
  }
}

//Update this method to complete challenge3.a, challenge3.b and challenge3.c
async function sendReq(data) {
  const { sender_id, recipient_id, status } = data;
  return new Promise((resolve, reject) => {
    knex_db
      .raw("SELECT * FROM friends WHERE sender_id = ? AND recipient_id = ?", [
        sender_id,
        recipient_id,
      ])
      .then((exists) => {
        if (exists.length > 0) {
          resolve(httpStatus.BAD_REQUEST);
          return;
        } else {
          knex_db
            .raw(
              "SELECT * FROM friends WHERE recipient_id = ? AND sender_id = ?",
              [sender_id, recipient_id]
            )
            .then((sent) => {
              if (sent.length > 0) {
                resolve(httpStatus.FORBIDDEN);
                return;
              } else {
                knex_db
                  .raw("UPDATE friends SET status = 'PENDING' WHERE id = ?", [
                    1,
                  ])
                  .then(() => {
                    resolve("");
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getPeopleYouMayKnow(id) {
  const parsedId = parseInt(id);
  return new Promise((resolve, reject) => {
    resolve([]);
  });
}

//Update this method to view the users to whom the requests were sent and complete challenge3.d
async function viewSentReqs(id) {
  let reqSentUsers = [];
  return reqSentUsers;
}

//Update this method to view the users whose the requests were received and complete challenge3.e
async function viewPendingReqs(id) {
  let reqReceivedUsers = [];
  return reqReceivedUsers;
}

//Update this method to complete the challenge3.f
async function acceptReq(id) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw("UPDATE friends SET status = 'PENDING' WHERE id = ?", [1])
      .then(() => {
        resolve("");
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Update this method to complete the challenge3.g
async function rejectReq(id) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw("SELECT * FROM friends WHERE id = ?", [id])
      .then((rowFound) => {
        if (!rowFound[0]) {
          resolve("Request not found!");
          return;
        }
        knex_db
          .raw("UPDATE friends SET status = 'PENDING' WHERE id = ?", [1])
          .then(() => {
            resolve("");
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function cancelReq(id) {
  return new Promise((resolve, reject) => {
    resolve("Request cancelled successfully!");
  });
}

async function removeFriend(id) {
  return new Promise((resolve, reject) => {
    resolve("Friend removed successfully!");
  });
}

//Update this method to complete the challenge4.a
async function viewFriends(id) {
  let friends = [];
  return friends;
}

async function getPeopleFromKeyword(id, keyword, pageNumber) {
  let query;
  const pageSize = 3;
  const offset = (pageNumber - 1) * pageSize;
  if (!keyword) {
    query = "";
  } else {
    query = "";
  }
  return new Promise((resolve, reject) => {
    resolve([]);
  });
}

export default {
  init,
  getSuggestedFriends,
  sendReq,
  getPeopleYouMayKnow,
  viewSentReqs,
  viewPendingReqs,
  acceptReq,
  rejectReq,
  cancelReq,
  removeFriend,
  viewFriends,
  getPeopleFromKeyword,
};
