class Group {
    constructor(id, name, description, hobbies, capacity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.hobbies = hobbies;
        this.capacity = capacity;
        this.users = [];
    }
}

export default Group;