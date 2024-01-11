import express from 'express';
import groupService from '../services/groupService.js';
export const router = express.Router();
import HttpStatus from "../enums/httpStatus.js";


router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const groups = await groupService.getGroupsFromUser(parseInt(userId));
    res.json(groups);
});

router.get('/:userId/userGroups', async (req, res) => {
    const userId = req.params.userId;
    const groups = await groupService.getGroupsOfUserReq(userId);
    res.json(groups);
});

router.get('/:groupId/groupProjects', async (req, res) => {
    const groupId = req.params.groupId;
    const projects = await groupService.getProjectsOfGroupReq(groupId);
    res.json(projects);
});

router.get('/:userId/:groupId/userTasks', async (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    const tasks = await groupService.getTasksOfUserReq(userId, groupId);
    res.json(tasks);
});

router.get('/:projectId/projectTasks', async (req, res) => {
    const projectId = req.params.projectId;
    const tasks = await groupService.getTasksOfProjectReq(projectId);
    res.json(tasks);
});

router.get('/:groupId/users', async (req, res) => {
    const groupId = req.params.groupId;
    const users = await groupService.getUsersOfGroupsReq(groupId);
    res.json(users);
});

// Implement the route method for updateProject in challenge 12 here
//
//
//
//
//
//

// Implement the route method for updateTask in challenge 13 here
//
//
//
//
//
//

router.get('/:projectId/project', async (req, res) => {
    const projectId = req.params.projectId;
    const project = await groupService.getProjectByIdReq(projectId);
    res.json(project);
});

// Implement the route method for updateProjectStatus in challenge 14 here
//
//
//
//
//
//

// Implement the route method for updateTaskStatus in challenge 15 here
//
//
//
//
//
//

router.post("/addNewProject", async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewProjectReq(data);
    res.status(response.status).json(response);
});

router.post("/addNewTask", async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewTaskReq(data);
    res.status(response.status).json(response);
});

router.get('/keywordsearch/:keyword', async (req, res) => {
    let keyword = req.params.keyword;
    const groupSearchFilter = await groupService.getUserGroupsByKeyword(keyword);
    res.send(groupSearchFilter);
});

router.post('/addNewGroup', async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewGroup(data)
    res.send(response);
});

router.post('/addUserIntoGroup', async (req, res) => {
    const data = req.body;
    const response = await groupService.addUserToGroup(data);
    res.send(response);
})

export default router;