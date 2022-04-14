/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('reservations_slots', tbl => {
        tbl.increments('id').primary()
        tbl.integer('id_reservation').notNullable()
        tbl.integer('id_slot').notNullable()

        
        tbl.foreign('id_reservation')
            .references('id').inTable('reservations').onDelete('CASCADE').onUpdate('CASCADE')
        tbl.foreign('id_slot')
            .references('id').inTable('slots').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('reservations_slots')
};
