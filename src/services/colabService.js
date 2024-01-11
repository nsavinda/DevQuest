import httpStatus from '../enums/httpStatus.js';
import dbConnection from '../../sqlite.js';
import colabWhiteBoardRepository from '../repositories/colabWhiteBoardRepository.js';
import colabSharedDocsRepository from '../repositories/colabSharedDocsRepository.js';

import knex_db from '../../db/db-config.js';
import knex from 'knex';

//initialize db connection
function initializeApp() {
    dbConnection
        .getDbConnection()
        .then((db) => {
            colabSharedDocsRepository.init(db);
            colabWhiteBoardRepository.init(db);
        })
        .catch((err) => {
            console.error('Error initializing the application:', err);
            process.exit(1); // Exit the application or handle the error appropriately
        });
}

async function getDocById(doc_id) {
    const response = await colabSharedDocsRepository.getDocById(doc_id);
    return { response: response, status: httpStatus.OK };
}

async function getWhiteBoardDataByGroup(group_id) {
    // console.log(group_id);
    try {
        const results = await knex_db('colab_whiteboard')
            .where('group_id', group_id)
            .orderBy('id', 'desc')
            .limit(1);
        //    console.log('results', results);
        return results;
    } catch (error) {
        console.error('Error fetching whiteboard data:', error);
        throw error;
    }
}

async function addWhiteBoardData(data) {
    try {
        const { whiteboard_json, group_id, user_id } = data;
        const [id] = await knex_db('colab_whiteboard')
            .insert({
                whiteboard_json,
                group_id,
                user_id
            })
            .returning('id');
        return id;
    } catch (error) {
        console.error('Error adding whiteboard data:', error);
        throw error;
    }
}

// Implement this method for Challenge 8
// async function addNewDoc(data) {
// }

// Implement this method for Challenge 8
// async function getAllDocsByGroup(group_id) {
// }

export default {
    initializeApp,
    getDocById,
    getWhiteBoardDataByGroup,
    addWhiteBoardData
};
