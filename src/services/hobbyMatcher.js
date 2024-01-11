class HobbyMatcher {
    constructor(userRepository) {
        this.usersRepository = userRepository;
        this.users = [];
    }

    async suggestFriends(userId, friendsLimit) {
        return await this.usersRepository.getUsers();
    }

    filterSuggestedFriends(users, currentUser) { }
}

export default HobbyMatcher;