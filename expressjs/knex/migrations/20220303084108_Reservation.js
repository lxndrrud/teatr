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
        tbl.string('confirmation_code', 6).notNullable()
        tbl.integer('id_session')
        tbl.integer('id_user')


        tbl.foreign('id_session')
            .references('id').inTable('sessions').onDelete('SET NULL').onUpdate('CASCADE')
        tbl.foreign('id_user')
            .references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('reservations')
};
