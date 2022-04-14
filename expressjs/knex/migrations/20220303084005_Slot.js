/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('slots', tbl => {
        tbl.increments('id').primary()
        tbl.float('price').notNullable()
        tbl.integer('id_price_policy').notNullable()
        tbl.integer('id_seat').notNullable()
        

        tbl.foreign('id_price_policy')
            .references('id').inTable('price_policies').onDelete('CASCADE').onUpdate('CASCADE')
        tbl.foreign('id_seat')
            .references('id').inTable('seats').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('slots')
};
