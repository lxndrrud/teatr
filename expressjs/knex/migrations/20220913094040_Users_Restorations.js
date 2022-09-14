/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('users_restorations', tbl => {
        tbl.increments('id').primary()

        tbl.integer('id_user').unsigned().notNullable()
        tbl.integer('id_emailing_type').unsigned().notNullable()

        tbl.string('code').notNullable()

        tbl.timestamp('time_created').notNullable().defaultTo(knex.fn.now())

        tbl.foreign('id_user')
            .references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')

        tbl.foreign('id_emailing_type')
            .references('id').inTable('emailing_types').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('users_restorations')
};
