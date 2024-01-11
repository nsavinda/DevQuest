/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
        .createTable('groups', function (table) {
            table.increments('id').primary();
            table.string('name', 50).notNullable();
            table.string('description', 255).notNullable();
            table.string('hobbies', 255).notNullable();
            table.decimal('capacity').notNullable();
        })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema
        .dropTable("groups");
}
