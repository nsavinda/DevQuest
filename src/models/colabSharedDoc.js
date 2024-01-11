class ColabSharedDoc {
    constructor(id, file_name, file_desc, file_path, group_id, user_id, created_at, updated_at) {
        this.id = id;
        this.file_name = file_name;
        this.file_desc = file_desc;
        this.file_path = file_path;
        this.group_id = group_id;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export default ColabSharedDoc;