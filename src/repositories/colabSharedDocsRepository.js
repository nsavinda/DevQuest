import ColabSharedDoc from "../models/colabSharedDoc.js";
import knex_db from "../../db/db-config.js";
import knex from "knex";

let _db;
function init(db) {
    _db = db;
}

// Implement this method for Challenge 8
async function getAllDocsByGroup(group_id) {
}

async function getDocById(doc_id) {
    return new Promise((resolve, reject) => {
        knex_db('colab_shared_docs')
            .where('id', doc_id)
            .first()
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Implement this method for Challenge 8
async function addNewDoc(data) {
}

function parseSharedDocsData(data) {
    return data.map(item => {
        return new ColabSharedDoc(item.id, item.file_name, item.file_desc, item.file_path, item.group_id, item.user_id, item.created_at, item.updated_at);
    });
}


export default {
    getAllDocsByGroup,
    getDocById,
    addNewDoc,
};