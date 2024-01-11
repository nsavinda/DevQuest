/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("colab_whiteboard", function (table) {
        table.increments("id").primary();
        table.integer("group_id", 10).notNullable()
            .references("id")
            .inTable("groups")
            .onDelete("CASCADE");
        table.string("whiteboard_json", 0).notNullable();
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
    return knex.schema.dropTable("colab_whiteboard");
};
