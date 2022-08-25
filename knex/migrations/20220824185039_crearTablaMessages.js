/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.hasTable('messages').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('messages', table => {
                table.increments('id').primary().notNullable();
                table.string('email', 255).notNullable();
                table.string('text', 255).notNullable();
                table.string('date').notNullable();
            });
        }
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('messages');

};
