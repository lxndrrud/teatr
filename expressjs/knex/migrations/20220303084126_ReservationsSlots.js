/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('reservations_slots', tbl => {
        tbl.increments('id').primary()
        tbl.integer('id_reservation').notNullable()
            .references('id').inTable('reservations')
        tbl.integer('id_slot').notNullable()
            .references('id').inTable('slots')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('reservations_slots')
};
