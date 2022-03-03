/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('records', tbl => {
        tbl.increments('id').primary()
        tbl.string('email', 70).notNullable()
        tbl.string('firstname', 70).nullable().defaultTo('Не указано')
        tbl.string('middlename', 70).nullable().defaultTo('Не указано')
        tbl.string('lastname', 70).nullable().defaultTo('Не указано')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('records')
};
