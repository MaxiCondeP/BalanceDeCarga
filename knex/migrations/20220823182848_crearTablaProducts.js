/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export function up(knex,Promise){
    return knex.schema.hasTable('products').then(function(exists){
        if(!exists){
            return knex.schema.createTable('products', table=>{
                table.increments('id').primary().notNullable();
                table.string('title',255).notNullable();
                table.float('price').notNullable();
                table.string('thumbnail').notNullable();
            });
        }
    })
  
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export function down (knex) {
    return knex.schema.dropTable('products');  
};