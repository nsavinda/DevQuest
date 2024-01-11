import ColabWhiteBoard from "../models/colabWhiteBoard.js";
import knex_db from "../../db/db-config.js";
import knex from "knex";

let _db;
function init(db) {
    _db = db;
}

// Implement this method for Challenge 7
// async function getWhiteBoardDataByGroup(group_id) {
// }

// Implement this method for Challenge 7
// async function addWhiteBoardData(data) {
// }

function parseWhiteBoardData(data) {
    return data.map(item => {
        return new ColabWhiteBoard(item.id, item.group_id, item.whiteboard_json, item.user_id, item.created_at, item.updated_at);
    });
}


export default {
    init,
    parseWhiteBoardData
};