import knex from 'knex';
import knex_db from '../../db/db-config.js';
import userRepository from './userRepository.js';
import httpStatus from '../enums/httpStatus.js';

let _db;
function init(db) {
    _db = db;
}

//Update this method to complete challenge2.a
async function getSuggestedFriends(userId) {
    try {
        const userHobbies = await knex_db('hobbies').where('userId', userId).select('name', 'rate');
        const otherUsers = await knex_db('hobbies')
            .whereNot('userId', userId)
            .whereIn(
                'name',
                userHobbies.map((hobby) => hobby.name)
            )
            .select('userId', 'name', 'rate');

        const friends = await knex_db('friends')
            .where('status', 'ACCEPTED')
            .andWhere(function () {
                this.where('sender_id', userId).orWhere('recipient_id', userId);
            });
        const friendIds = friends.map((friend) =>
            friend.sender_id == userId ? friend.recipient_id : friend.sender_id
        );

        let filteredOtherUsers = otherUsers.filter((user) => !friendIds.includes(user.userId));
        filteredOtherUsers = filteredOtherUsers
            .map((user) => {
                const userHobby = userHobbies.find((hobby) => hobby.name === user.name);
                const rateDifference = Math.abs(userHobby.rate - user.rate);
                return { ...user, rateDifference };
            })
            .sort((a, b) => a.rateDifference - b.rateDifference);

        const minRateDifference = filteredOtherUsers[0].rateDifference;
        filteredOtherUsers = filteredOtherUsers.filter(
            (user) => user.rateDifference === minRateDifference
        );
        filteredOtherUsers = filteredOtherUsers.slice(0, 5);

        const suggestedFriends = await Promise.all(
            filteredOtherUsers.map(async (user) => {
                const userDetails = await userRepository.getUser(user.userId);
                return userDetails;
            })
        );

        suggestedFriends.forEach((user) => {
            user.hobbies.sort((a, b) => a.name.localeCompare(b.name));
        });

        return suggestedFriends;
    } catch (error) {
        console.error('Could not fetch suggested friends:', error);
        return [];
    }
}

//Update this method to complete challenge3.a, challenge3.b and challenge3.c
async function sendReq(data) {
    const { sender_id, recipient_id, status } = data;
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                'SELECT * FROM friends WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)',
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
                            text: 'Request already received!'
                        });
                        return;
                    }
                    resolve({
                        status: httpStatus.BAD_REQUEST,
                        text: 'Request already sent!'
                    });
                    return;
                } else {
                    knex_db
                        .raw(
                            'INSERT INTO friends (sender_id, recipient_id, status) VALUES (?, ?, ?)',
                            [sender_id, recipient_id, status]
                        )
                        .then(() => {
                            resolve({ status: httpStatus.OK, text: 'success' });
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
    return new Promise(async (resolve, reject) => {
        try {
            let queue = [parsedId];
            let visited = new Set();

            while (queue.length > 0) {
                const currentId = queue.shift();
                visited.add(currentId);

                const friends = await knex_db('friends')
                    .where(function () {
                        this.where('sender_id', currentId).orWhere('recipient_id', currentId);
                    })
                    .andWhere('status', 'ACCEPTED');

                if (friends.length === 0) {
                    resolve([]);
                    return;
                }

                console.log('friends', friends);
                for (const friend of friends) {
                    const friendId =
                        friend.sender_id === currentId ? friend.recipient_id : friend.sender_id;
                    if (!visited.has(friendId)) {
                        queue.push(friendId);
                    }
                }
            }

            // get immediate friends
            const friends = await knex_db('friends')
                .where(function () {
                    this.where('sender_id', parsedId).orWhere('recipient_id', parsedId);
                })
                .andWhere('status', 'ACCEPTED');

            const friendIds = friends.map((friend) =>
                friend.sender_id === parsedId ? friend.recipient_id : friend.sender_id
            );

            friendIds.forEach((id) => visited.delete(id));
            visited.delete(parsedId);

            console.log('visited', visited);

            let user_details = [];
            for (const id of visited) {
                const userDetails = await userRepository.getUser(id);
                delete userDetails.hobbies;
                delete userDetails.skills;
                user_details.push(userDetails);
            }

            resolve(user_details);
        } catch (error) {
            reject(error);
        }
    });
}

//Update this method to view the users to whom the requests were sent and complete challenge3.d
async function viewSentReqs(id) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw('SELECT * FROM friends WHERE sender_id = ? AND status = ?', [id, 'PENDING'])
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
    console.log('id', id);
    let userId = id;

    const friends = await knex_db('friends')
        .where('status', 'PENDING')
        .andWhere(function () {
            this.where('sender_id', userId).orWhere('recipient_id', userId);
        });
    let friendIds = friends.map((friend) =>
        friend.sender_id == userId ? friend.recipient_id : friend.sender_id
    );

    let requestIds = friends.map((friend) => friend.id);
    console.log('requestIds', requestIds);

    console.log('friendIds', friendIds);
    friendIds = [...new Set(friendIds)];

    let pendingRequests = [];
    for (let friendId of friendIds) {
        const userDetails = await userRepository.getUser(friendId);
        const request = friends.find(
            (friend) => friend.sender_id == friendId || friend.recipient_id == friendId
        );
        userDetails.reqId = request.id;
        pendingRequests.push(userDetails);
    }

    return pendingRequests;
    return pendingRequests;
}

//Update this method to complete the challenge3.f
async function acceptReq(id) {
    console.log('ID---', id);
    return new Promise((resolve, reject) => {
        knex_db
            .raw("UPDATE friends SET status = 'ACCEPTED' WHERE id = ?", [id])
            .then(() => {
                resolve({ text: 'success' });
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
                resolve('Request deleted successfully!');
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

async function cancelReq(id) {
    const friendRequest = await knex_db('friends')
        .where('id', id)
        .andWhere('status', 'PENDING')
        .first();

    if (!friendRequest) {
        return 'Request not found!';
    }

    await knex_db('friends').where('id', id).del();

    return 'Request cancelled successfully!';
}

async function removeFriend(id) {
    // console.log(id);
    const result = await knex_db('friends').where('id', id).andWhere('status', 'ACCEPTED').first();

    if (!result) {
        return 'Friend not found!';
    } else {
        await knex_db('friends').where('id', id).del();
    }
    // console.log(result);

    if (result) {
        return 'Friend removed successfully!';
    } else {
        return 'Friend not found!';
    }
}

//Update this method to complete the challenge4.a
async function viewFriends(id) {
    return new Promise((resolve, reject) => {
        knex_db('friends')
            .where('status', 'ACCEPTED')
            .andWhere(function () {
                this.where('sender_id', id).orWhere('recipient_id', id);
            })
            .then((friends) => {
                const promises = friends.map(
                    (friend) =>
                        new Promise(async (resolve, reject) => {
                            try {
                                let userId =
                                    friend.sender_id == id ? friend.recipient_id : friend.sender_id;
                                const user = await userRepository.getUser(userId);

                                user.reqId = friend.id;
                                resolve(user);
                            } catch (error) {
                                reject(error);
                            }
                        })
                );

                Promise.all(promises).then((users) => {
                    resolve(users);
                });
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

async function getPeopleFromKeyword(id, keyword, pageNumber) {
    let query;
    const pageSize = 3;
    const offset = (pageNumber - 1) * pageSize;

    if (!keyword) {
        query = '';
    } else {
        query = keyword;
    }

    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                `
                SELECT
                us.email,
                us.firstname,
                us.gender,
                us.id,
                us.image_url,
                us.lastname,
                MAX(CASE WHEN fr.sender_id = ? OR fr.recipient_id = ? THEN fr.recipient_id ELSE NULL END) as recipient_id,
                MAX(CASE WHEN fr.sender_id = ? OR fr.recipient_id = ? THEN fr.id ELSE NULL END) as reqId,
                MAX(CASE WHEN fr.sender_id = ? OR fr.recipient_id = ? THEN fr.sender_id ELSE NULL END) as sender_id,
                MAX(CASE WHEN fr.sender_id = ? OR fr.recipient_id = ? THEN fr.status ELSE NULL END) as status
                FROM users us
                LEFT JOIN hobbies uht ON us.id = uht.userId
                LEFT JOIN skills ust ON us.id = ust.userId
                LEFT JOIN friends fr ON fr.sender_id = us.id OR fr.recipient_id = us.id
                WHERE 
                    us.id <> ? AND (
                    (us.firstname LIKE ?) OR
                    (us.lastname LIKE ?) OR
                    (ust.name LIKE ?) OR
                    (uht.name LIKE ?) )
                GROUP BY us.id, us.email, us.firstname, us.lastname, us.gender, us.image_url
                ORDER BY us.id
                LIMIT ?
                OFFSET ?;

            `,
                [
                    id,
                    id,
                    id,
                    id,
                    id,
                    id,
                    id,
                    id,
                    id,
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    pageSize,
                    offset
                ]
            )
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
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
    getPeopleFromKeyword
};
