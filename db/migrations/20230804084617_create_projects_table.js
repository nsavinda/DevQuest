/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
    .createTable('projects', function (table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('description', 255).notNullable();
        table.string('ownerId', 255).unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('createdDate', 255).notNullable();
        table.string('dueDate', 255).notNullable();
        table.integer('projectStatus', 10).notNullable();
        table.string('groupId', 255).unsigned().references('id').inTable('groups').onDelete('CASCADE');
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema
    .dropTable("projectsTable");
};