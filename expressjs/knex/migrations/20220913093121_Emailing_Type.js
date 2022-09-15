/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('emailing_types', tbl => {
        tbl.increments('id').primary()
        tbl.string('title').notNullable()
        tbl.bigInteger('repeat_interval').unsigned().notNullable()
        tbl.bigInteger('resend_interval').unsigned().notNullable()
        tbl.boolean('repeatable').notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('emailing_types')
};
