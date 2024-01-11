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
  return [];
}

//Update this method to complete challenge3.a, challenge3.b and challenge3.c
async function sendReq(data) {
  const { sender_id, recipient_id, status } = data;
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        "SELECT * FROM friends WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)",
        [sender_id, recipient_id, recipient_id, sender_id]
      )
      .then((exists) => {
        if (exists.length > 0) {
          if (
            exists[0].sender_id === recipient_id &&
            exists[0].recipient_id === sender_id
          ) {
            resolve({
              status: httpStatus.BAD_REQUEST,
              text: "Request already received!",
            });
            return;
          }
          resolve({
            status: httpStatus.BAD_REQUEST,
            text: "Request already sent!",
          });
          return;
        } else {
          knex_db
            .raw(
              "INSERT INTO friends (sender_id, recipient_id, status) VALUES (?, ?, ?)",
              [sender_id, recipient_id, status]
            )
            .then(() => {
              resolve({ status: httpStatus.OK, text: "success" });
            })
            .catch((error) => {
              reject(error);
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
  return new Promise((resolve, reject) => {
    knex_db
      .raw("SELECT * FROM friends WHERE sender_id = ? AND status = ?", [
        id,
        "PENDING",
      ])
      .then((sentRequests) => {
        resolve(sentRequests);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Update this method to view the users whose the requests were received and complete challenge3.e
async function viewPendingReqs(id) {
  console.log("id", id)
  return new Promise((resolve, reject) => {
    knex_db
      .select(
        "friends.id as reqId",
        "users.id",
        "users.email",
        "users.gender",
        "users.firstname",
        "users.lastname",
        "users.image_url",
      )
      // .from("friends")
      // .join("users", "users.id", "friends.sender_id")
      // // .join("user_hobbies", "user_hobbies.user_id", "users.id")
      // .join("hobbies", "hobbies.id", "users.id")
      // // .join("user_skills", "user_skills.user_id", "users.id")
      // .join("skills", "skills.id", "hobbies.id")
      // .where("friends.recipient_id", id)
      // .andWhere("friends.status", "PENDING")
      // .groupBy("users.id", "friends.id")
      .then((pendingRequests) => {
        console.log("aaaaaaaaaa", pendingRequests);
        resolve(pendingRequests);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}


//Update this method to complete the challenge3.f
async function acceptReq(id) {
  console.log("ID---", id)
  return new Promise((resolve, reject) => {
    knex_db
      .raw("UPDATE friends SET status = 'ACCEPTED' WHERE id = ?", [id])
      .then(() => {
        resolve({ text: "success" });
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
      .raw("DELETE from friends WHERE status = 'PENDING' AND id = ?", [id])
      .then(() => {
        resolve("Request deleted successfully!");
      })
      .catch((error) => {
        console.error(error);
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
