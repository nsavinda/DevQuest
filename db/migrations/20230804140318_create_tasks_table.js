/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
    .createTable('tasks', function (table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('description', 255).notNullable();
        table.string('assigneeId', 255).unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('reporterId', 255).unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('createdDate', 255).notNullable();
        table.string('dueDate', 255).notNullable();
        table.string('projectId', 255).unsigned().references('id').inTable('projects').onDelete('CASCADE');
        table.integer('taskStatus', 10).notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema
    .dropTable("tasksTable");
};