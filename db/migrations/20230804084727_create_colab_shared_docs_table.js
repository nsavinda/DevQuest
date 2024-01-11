/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("colab_shared_docs", function (table) {
        table.increments("id").primary();
        table.string("file_name", 255).notNullable();
        table.string("file_desc", 255).notNullable();
        table.string("file_path", 255).notNullable().unique();
        table.integer("group_id", 10).notNullable()
            .references("id")
            .inTable("groups")
            .onDelete("CASCADE");
        table.integer("user_id", 10).notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("colab_shared_docs");
};
