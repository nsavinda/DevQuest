class User {
    constructor(email, password, firstname, lastname, hobbies, skills, imageUrl) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.hobbies = hobbies;
        this.skills = skills;
        this.image_url = imageUrl;
    }

    getHobbies() {
        return this.hobbies;
    }

    getSkills() {
        return this.skills;
    }
}

export default User;
