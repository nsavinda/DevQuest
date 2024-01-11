import knex from 'knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const secretKey = '@SecretKey#123!';
import knex_db from '../../db/db-config.js';

let _db;
function init(db) {
    _db = db;
}

async function getUsers() {
  try {
    // select all without password
    const users = await knex_db('users').select('*');
    // remove password from each user

    // users.forEach((user) => {
    //   delete user.password;

    //   // get the hobbies of the user
    //   knex_db('hobbies').select('*').where('userId', user.id).then((hobbies) => {
    //     user.hobbies = hobbies;
    //     // console.log(user.hobbies)

    //     // get the skills of the user
    //     knex_db('skills').select('*').where('userId', user.id).then((skills) => {
    //       user.skills = skills;
    //     });
    //   });
      
    // });

    // {
    //   id: 1,
    //   email: "mscott@office.com",
    //   gender: "Male",
    //   image_url:
    //     "https://upload.wikimedia.org/wikipedia/en/d/dc/MichaelScott.png",
    //   firstname: "Michael",
    //   lastname: "Scott",
    //   hobbies: [
    //     { name: "Gym", rate: 4 },
    //     { name: "Soccer", rate: 5 },
    //     { name: "Sports", rate: 3 },
    //   ],
    //   skills: [
    //     { name: "C++", rate: 4 },
    //     { name: "Java", rate: 5 },
    //     { name: "Python", rate: 3 },
    //   ],
    // },

    for(let user of users) {
      delete user.password;

      const hobbies = await knex_db('hobbies').select('*').where('userId', user.id).orderBy('hobbies.name');
      user.hobbies = hobbies;

      for(let hobby of user.hobbies) {
        delete hobby.id;
        delete hobby.userId;
      }

      const skills = await knex_db('skills').select('*').where('userId', user.id);
      user.skills = skills;

      for(let skill of user.skills) {
        delete skill.id;
        delete skill.userId;
      }


    }

    console.log("users")

    console.log(users)

    return users;
  } catch (error) {
    console.error("Could not fetch users:", error);
    return [];
  }
}


//Update this method to complete challenge0.c and challenge1.b
async function getUser(id) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                `
        SELECT
          ut.id,
          ut.email,
          ut.gender,
          ut.firstname,
          ut.lastname,
          ut.image_url,
          uht.name AS hobbyName,
          uht.rate AS hobbyRate,
          ust.name AS skillName,
          ust.rate AS skillRate
        FROM users ut
        LEFT JOIN hobbies uht ON ut.id = uht.userId
        LEFT JOIN skills ust ON ut.id = ust.userId
        WHERE ut.id = ?
        `,
                [id]
            )
            .then((result) => {
                const rows = result;
                let hobbyExist, skillExist;

                if (rows.length === 0) {
                    resolve('User not found!');
                    return;
                }

                const user = {
                    id: rows[0].id,
                    email: rows[0].email,
                    gender: rows[0].gender,
                    firstname: rows[0].firstname,
                    lastname: rows[0].lastname,
                    image_url: rows[0].image_url,
                    hobbies: [],
                    skills: []
                };

                rows.forEach((row) => {
                    hobbyExist = false;
                    if (row.hobbyName && row.hobbyRate) {
                        user.hobbies.map((hobby) => {
                            if (hobby.name === row.hobbyName) {
                                hobbyExist = true;
                            }
                        });
                        if (!hobbyExist) {
                            user.hobbies.push({
                                name: row.hobbyName,
                                rate: row.hobbyRate
                            });
                        }
                    }

                    hobbyExist = false;
                    if (row.skillName && row.skillRate) {
                        user.skills.map((skill) => {
                            if (skill.name === row.skillName) {
                                skillExist = true;
                            }
                        });
                        if (!skillExist) {
                            user.skills.push({
                                name: row.skillName,
                                rate: row.skillRate
                            });
                        }
                    }
                });

                resolve(user);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

//delete a user
async function deleteUser(id) {
    await knex_db.raw('PRAGMA foreign_keys = ON');

    return new Promise((resolve, reject) => {
        knex_db.raw('SELECT * FROM users WHERE id = ?', [id]).then((userFound) => {
            if (!userFound[0]) {
                resolve('User not found!');
                return;
            }

            knex_db
                .raw('DELETE FROM users WHERE id = ?', [id])
                .then(() => {
                    resolve('User deleted successfully!');
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    });
}

// insert user
async function insertUser(user) {
  return new Promise((resolve, reject) => {

    user.password = "Ryan1234";
    console.log(user.email)
    bcrypt.hash(user.password, 10, async (err, hash) => {
      if (err) {
        reject(err);
      } else {
        user.password = hash;

        try {
          const [userId] = await knex_db('users').insert({
            email: user.email,
            password: user.password,
            gender: user.gender,
            image_url: user.image_url,
            firstname: user.firstname,
            lastname: user.lastname,
          }).returning('id');

          for (let hobby of user.hobbies) {
            await knex_db('hobbies').insert({
              userId: userId,
              name: hobby.name,
              rate: hobby.rate,
            });
          }

          for (let skill of user.skills) {
            await knex_db('skills').insert({
              userId: userId,
              name: skill.name,
              rate: skill.rate,
            });
          }

          resolve('User inserted successfully!');
        } catch (error) {
          console.error(error);
          reject(error);
        }
      }
    });
  });
}

export default {
  getUsers,
  init,
  getUser,
  deleteUser,
  insertUser,
};
