import httpStatus from "../enums/httpStatus.js";
import dbConnection from "../../sqlite.js";
import colabWhiteBoardRepository from "../repositories/colabWhiteBoardRepository.js";
import colabSharedDocsRepository from "../repositories/colabSharedDocsRepository.js";

//initialize db connection
function initializeApp() {
    dbConnection
        .getDbConnection()
        .then((db) => {
            colabSharedDocsRepository.init(db);
            colabWhiteBoardRepository.init(db);
        })
        .catch((err) => {
            console.error("Error initializing the application:", err);
            process.exit(1); // Exit the application or handle the error appropriately
        });
}



async function getDocById(doc_id) {
    const response = await colabSharedDocsRepository.getDocById(doc_id);
    return { response: response, status: httpStatus.OK };
}

// Implement this method for Challenge 7
// async function getWhiteBoardDataByGroup(group_id) {
// }

// Implement this method for Challenge 7
// async function addWhiteBoardData(data) {
// }

// Implement this method for Challenge 8
// async function addNewDoc(data) {
// }

// Implement this method for Challenge 8
// async function getAllDocsByGroup(group_id) {
// }

export default {
    initializeApp,
    getDocById,
};