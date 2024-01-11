import Group from "../models/group.js";
import HttpStatus from "../enums/httpStatus.js";
import knex_db from "../../db/db-config.js";
import knex from "knex";

let _db;
function init(db) {
  _db = db;
}

// Implement the method body for challenge 8
async function getGroupsOfUser(userid) {

}

async function getProjectsOfGroup(groupId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        `SELECT pt.*, ut.image_url 
      FROM projects pt JOIN users ut on ut.id = pt.ownerId
      WHERE groupId = ?`,
        [groupId]
      )
      .then((result) => {
        const projects = result;
        resolve(projects);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getTasksOfUser(userId, groupId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        ` SELECT tt.*, pt.name AS projectName, pt.projectStatus
         FROM tasks tt LEFT JOIN projects pt ON tt.projectId = pt.id WHERE tt.assigneeId = ? AND pt.groupId = ?`,
        [userId, groupId]
      )
      .then((result) => {
        const tasks = result;
        resolve(tasks);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getTasksOfProject(projectId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(` SELECT tt.* FROM tasks tt WHERE tt.projectId = ?`, [projectId])
      .then((result) => {
        const tasks = result;
        resolve(tasks);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getUsersOfGroups(groupId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        ` SELECT 
        ut.id,
        ut.email,
        ut.image_url 
        FROM users ut
        LEFT JOIN userGroups ug
        ON ug.user_id=ut.id
        WHERE ug.group_id = ?`,
        [groupId]
      )
      .then((result) => {
        const users = result;
        resolve(users);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Implement this method body for challenge 10
async function addNewProject(projectDetails) {

}

// Implement this method body for challenge 11
async function addNewTask(taskDetails) {

}

// Implement this method for challenge 12
async function updateProject(details, projectId) {

}

// Implement this method for challenge 13
async function updateTask(details, taskId) {

}

// Implement this method for challenge 14
async function updateProjectStatus(projectId, status) {

}

// Implement this method for challenge 15
async function updateTaskStatus(taskId, status) {

}

async function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(` SELECT * FROM projects WHERE id = ?`, [projectId])
      .then((result) => {
        const project = result;
        resolve(project);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


// Implement this method for Challenge 5
async function getGroupsFromKeyword(keyword) {
}

// Implement this method for Challenge 5
async function addNewGroup(data) {
}

// Implement this method for Challenge 6
async function addUserToGroup(data) {
}

// Implement this method for challenge 6
async function getGroupsFromUser(userId) {
}

function parseGroupsData(data) {
  return data.map(item => {
    return new Group(item.id, item.name, item.description, JSON.parse(item.hobbies), item.capacity)
  });
}

export default {
  init,
  getGroupsOfUser,
  getProjectsOfGroup,
  getTasksOfUser,
  getTasksOfProject,
  getUsersOfGroups,
  updateProject,
  updateTask,
  getProjectById,
  updateProjectStatus,
  updateTaskStatus,
  addNewProject,
  addNewTask,
  getGroupsFromUser,
  addUserToGroup,
  getGroupsFromKeyword,
  addNewGroup
};
