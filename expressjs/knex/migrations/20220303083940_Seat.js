/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('seats', tbl => {
        tbl.increments('id').primary()
        tbl.integer('number').notNullable()
        tbl.integer('id_row').notNullable()
            .references('id').inTable('rows')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('seats')
};
