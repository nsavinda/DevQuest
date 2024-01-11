class ColabWhiteBoard {
    constructor(id, group_id, whiteboard_json, user_id, created_at, updated_at) {
        this.id = id;
        this.group_id = group_id;
        this.whiteboard_json = whiteboard_json;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export default ColabWhiteBoard;