const moment = require('moment')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('reservations', tbl => {
        tbl.increments('id').primary()
        tbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
        tbl.boolean('is_paid').notNullable().defaultTo(false)
        tbl.boolean('is_confirmed').notNullable().defaultTo(false)
        tbl.string('code', 6).notNullable()
        tbl.string('confirmation_code', 6).notNullable()
        tbl.integer('id_session').notNullable()
            .references('id').inTable('sessions')
        tbl.integer('id_record').notNullable()
            .references('id').inTable('records')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('reservations')
};
