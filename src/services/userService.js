import httpStatus from "../enums/httpStatus.js";
import userRepository from "../repositories/userRepository.js";
import dbConnection from "../../sqlite.js";

//initialize db connection
function initializeApp() {
  dbConnection
    .getDbConnection()
    .then((db) => {
      userRepository.init(db);
    })
    .catch((err) => {
      console.error("Error initializing the application:", err);
      process.exit(1); // Exit the application or handle the error appropriately
    });
}

async function getUsers() {
  const response = await userRepository.getUsers();
  if (response === undefined) {
    return { status: httpStatus.NOT_FOUND };
  } else {
    return { response: response, status: httpStatus.OK };
  }
}

async function getUser(id) {
  const response = await userRepository.getUser(id);
  if (response === "User not found!" || response == undefined) {
    return { status: httpStatus.NOT_FOUND };
  } else if(response != null) {
    return { response: response, status: httpStatus.OK };
  } else {
    return { status: httpStatus.INTERNAL_SERVER_ERROR };
  }
}

async function deleteUser(id) {
  const response = await userRepository.deleteUser(id);
  if (response === "User not found!") {
    return { status: httpStatus.NOT_FOUND };
  } else {
    return { response: response, status: httpStatus.OK };
  }
}

initializeApp();
export default { getUsers, getUser, deleteUser };
