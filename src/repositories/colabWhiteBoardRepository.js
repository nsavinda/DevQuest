import ColabWhiteBoard from "../models/colabWhiteBoard.js";
import knex_db from "../../db/db-config.js";
import knex from "knex";

let _db;
function init(db) {
    _db = db;
}

async function getWhiteBoardDataByGroup(group_id) {
    try {
        const results = await knex_db('colab_whiteboard')
                               .where('group_id', group_id)
                               .select();
        return parseWhiteBoardData(results);
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



function parseWhiteBoardData(data) {
    return data.map(item => {
        return new ColabWhiteBoard(item.id, item.group_id, item.whiteboard_json, item.user_id, item.created_at, item.updated_at);
    });
}


export default {
    init,
    parseWhiteBoardData,
    getWhiteBoardDataByGroup,
    addWhiteBoardData

};