import HttpStatus from "../enums/httpStatus.js";
import Group from "../models/group.js";
import GroupRepository from "../repositories/groupRepository.js";

class HobbyGroupRecommender {
    constructor() {
        this.groupRepository = new GroupRepository();
    }

    addGroup(name, description, hobbies, capacity) {
        const group = new Group(name, description, hobbies, capacity);
        this.groups.push(group);
    }

    async getUserGroups(userId) {
        return await this.groupRepository.getGroupsFromUser(userId);
    }
    async getAllUserGroups(userId) {
        return await this.groupRepository.getAllGroupsFromUser(userId);
    }
    async getRecommendedGroups(userId) {
        return await this.groupRepository.getAllGroupsFromUser(userId);
    }

    async getUserGroupsByKeyword(keyword) {
        return await this.groupRepository.getGroupsFromKeyword(keyword);
    }

    async createNewGroup(data) {
        return await this.groupRepository.createNewGroup(data);
    }

    async insertUserToGroup(data) {
        return await this.groupRepository.insertUserToGroup(data);
    }

}

export default HobbyGroupRecommender;