/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
        .createTable('userGroups', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('id').inTable('users');
            table.integer('group_id').unsigned();
            table.foreign('group_id').references('id').inTable('groups');
            table.timestamps(true, true);
        });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('userGroups');
}
