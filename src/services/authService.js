import httpStatus from "../enums/httpStatus.js";
import authRepository from "../repositories/authRepository.js";
import dbConnection from "../../sqlite.js";

function initializeApp() {
  dbConnection
    .getDbConnection()
    .then((db) => {
      authRepository.init(db);
    })
    .catch((err) => {
      process.exit(1);
    });
}

async function signUp(data) {
  const response = await authRepository.signUp(data);
  if (response === "Email already exists!") {
    return { status: httpStatus.FORBIDDEN };
  } else if (response === undefined) {
    return { status: httpStatus.UNAUTHORIZED };
  } else {
    return { response: response, status: httpStatus.OK };
  }
}

async function login(data) {
  return await authRepository.login(data);
}

initializeApp();

export default { signUp, login };