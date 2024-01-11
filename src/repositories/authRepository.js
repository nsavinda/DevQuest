import knex from "knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secretKey = "@SecretKey#123!";
import knex_db from "../../db/db-config.js";
import HttpStatus from "../enums/httpStatus.js";

let _db;
function init(db) {
  _db = db;
}

async function signUp(data) {
  const {
    email,
    password,
    gender,
    firstname,
    lastname,
    hobbies,
    skills,
    image_url,
  } = data;

  return new Promise((resolve, reject) => {
    knex_db
      .raw("SELECT * FROM users WHERE email = ?", [email])
      .then((existingUser) => {
        if (existingUser.length > 0) {
          resolve("Try another email address");
        } else {
          const hashedPwd = bcrypt.hashSync(password, 10);
          knex_db
            .raw(
              "INSERT INTO users (email, password, gender, firstname, lastname, image_url) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
              [email, hashedPwd, gender, firstname, lastname, image_url]
            )
            .then(([userId]) => {
              const hobbyPromises = hobbies.map(async (hobby) => {
                const { name, rate } = hobby;
                const [hobbyId] = await knex_db.raw(
                  "INSERT INTO hobbies (userId, name, rate) VALUES (?, ?, ?) RETURNING id",
                  [userId.id, name, rate]
                );
              });

              const skillPromises = skills.map(async (skill) => {
                const { name, rate } = skill;
                const [skillId] = await knex_db.raw(
                  "INSERT INTO skills (userId, name, rate) VALUES (?, ?, ?) RETURNING id",
                  [userId.id, name, rate]
                );
                return skillId;
              });

              Promise.all([...hobbyPromises, ...skillPromises])
                .then(() => {
                  resolve("success");
                })
                .catch((error) => {
                  reject(error);
                });
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

async function login(data) {
  const { email, password } = data;
  let user;
  return new Promise((resolve, reject) => {
    knex_db
      .raw("SELECT * FROM users WHERE email = ?", [email])
      .then((result) => {
        user = result[0];
        if (!user) {
          resolve(HttpStatus.FORBIDDEN);
          return;
        }
        return bcrypt.compare(password, user.password);
      })
      .then((comparedPwd) => {
        if (!comparedPwd) {
          resolve(HttpStatus.NOT_FOUND);
          return;
        }
        const payload = {
          email: email,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        resolve({
          token: token,
          id: user.id,
        });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

export default {
  signUp,
  init,
  login,
};
