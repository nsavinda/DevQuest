import Group from '../models/group.js';
import userRepository from './userRepository.js';
import HttpStatus from '../enums/httpStatus.js';
import knex_db from '../../db/db-config.js';
import knex from 'knex';

let _db;
function init(db) {
    _db = db;
}

// Implement the method body for challenge 8
async function getGroupsOfUser(userid) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                ` SELECT 
        gp.id, 
        gp.name, 
        gp.description 
        FROM userGroups ug 
        LEFT JOIN groups gp ON gp.id = ug.group_id 
        WHERE ug.user_id = ?`,
                [userid]
            )
            .then((result) => {
                const groups = result;
                resolve(groups);
            })
            .catch((error) => {
                reject(error);
            });
    });
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
            .then(async(result) => {
                const users = result;
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    const userDetails = await userRepository.getUser(user.id);
                    users[i].firstname = userDetails.firstname;
                    users[i].lastname = userDetails.lastname;
                }

                resolve(users);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method body for challenge 10
async function addNewProject(projectDetails) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                'INSERT INTO projects (name, description, createdDate, dueDate, ownerId, groupId, projectStatus) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
                [
                    projectDetails.projectName,
                    projectDetails.projectDescription,
                    projectDetails.currentDate,
                    projectDetails.endDate,
                    projectDetails.userId,
                    projectDetails.seletedUserGroupId,
                    projectDetails.status
                ]
            )
            .then((result) => {
                resolve('success');
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method body for challenge 11
async function addNewTask(taskDetails) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                'INSERT INTO tasks (name, description, assigneeId, reporterId, createdDate, dueDate, projectId, taskStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
                [
                    taskDetails.name,
                    taskDetails.taskDescription,
                    taskDetails.assignee,
                    taskDetails.reporter,
                    taskDetails.createdDate,
                    taskDetails.dueDate,
                    taskDetails.projectId,
                    taskDetails.taskStatus
                ]
            )
            .then((result) => {
                resolve('success');
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method for challenge 12
async function updateProject(details, projectId) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw('UPDATE projects SET name = ?, description = ?, dueDate = ? WHERE id = ?', [
                details.projectName,
                details.projectDescription,
                details.endDate,
                projectId
            ])
            .then(() => {
                resolve({ text: 'success' });
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

// Implement this method for challenge 13
async function updateTask(details, taskId) {
    const result = await knex_db('tasks') 
        .where('id', taskId)
        .update({ name: details.taskName, description: details.taskDescription, dueDate: details.endDate, assigneeId: details.assignee });
    if (result) {
        return "success";
    } else {
        throw new Error("Task update failed");
    }
}

// Implement this method for challenge 14
async function updateProjectStatus(projectId, status) {
    const result = await knex_db('projects')
        .where('id', projectId)
        .update({ projectStatus: status });

    if (result) {
        return 'success';
    } else {
        throw new Error('Project update failed');
    }
}

// Implement this method for challenge 15
async function updateTaskStatus(taskId, status) {
    const result = await knex_db('tasks') 
        .where('id', taskId)
        .update({ taskStatus: status });

    if (result) {
        return "success";
    } else {
        throw new Error("Task update failed");
    }
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
    return new Promise((resolve, reject) => {
        knex_db
            .raw(` SELECT * FROM groups WHERE description LIKE ? OR name LIKE ? `, [
                `%${keyword}%`,
                `%${keyword}%`
            ])
            .then((result) => {
                const groups = result;

                resolve(groups);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method for Challenge 5
async function addNewGroup(data) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                'INSERT INTO groups (name, description, hobbies, capacity) VALUES (?, ?, ?, ?) RETURNING id',
                [data.group_name, data.group_desc, data.group_hobbies, data.group_capacity || 0]
            )
            .then((result) => {
                resolve('success');
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method for Challenge 6
async function addUserToGroup(data) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw('INSERT INTO userGroups (user_id, group_id) VALUES (?, ?) RETURNING id', [
                data.user_id,
                data.group_id
            ])
            .then((result) => {
                resolve('success');
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method for challenge 6
async function getGroupsFromUser(userId) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                ` SELECT 
                    gp.id, 
                    gp.name, 
                    gp.description 
                    FROM userGroups ug 
                    LEFT JOIN groups gp ON gp.id = ug.group_id 
                    WHERE ug.user_id = ?`,
                [userId]
            )
            .then((result) => {
                const groups = result;
                console.log(groups);
                resolve(groups);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function parseGroupsData(data) {
    return data.map((item) => {
        return new Group(
            item.id,
            item.name,
            item.description,
            JSON.parse(item.hobbies),
            item.capacity
        );
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
