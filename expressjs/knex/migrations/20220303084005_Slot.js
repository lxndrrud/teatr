/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('slots', tbl => {
        tbl.increments('id').primary()
        tbl.float('price').notNullable()
        tbl.integer('id_price_policy').notNullable()
            .references('id').inTable('price_policies')
        tbl.integer('id_seat').notNullable()
            .references('id').inTable('seats')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('slots')
};
