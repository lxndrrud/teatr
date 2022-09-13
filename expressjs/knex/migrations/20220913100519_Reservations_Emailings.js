/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('reservations_emailings', tbl => {
        tbl.bigIncrements('id').primary()
        tbl.integer('id_reservation').unsigned().notNullable()
        tbl.integer('id_emailing_type').unsigned().notNullable()
        tbl.timestamp('time_created').notNullable().defaultTo(knex.fn.now())

        tbl.foreign('id_reservation')
            .references('id').inTable('reservations').onDelete('CASCADE').onUpdate('CASCADE')
        
        tbl.foreign('id_emailing_type')
            .references('id').inTable('emailing_types').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('reservations_emailings')
};
