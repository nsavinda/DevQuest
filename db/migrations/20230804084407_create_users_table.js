/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("users", function (table) {
      table.increments("id").primary();
      table.string("email", 50).notNullable().unique();
      table.string("password", 255).notNullable();
      table.string("gender", 10).notNullable();
      table.string("firstname", 50).notNullable();
      table.string("lastname", 50).notNullable();
      table.string("image_url", 255);
    });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema.dropTable("users");
  }
  