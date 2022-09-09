/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('users', tbl => {
        tbl.increments('id').primary()
        tbl.string('email', 70).notNullable().unique()
        tbl.string('password').notNullable()
        tbl.string('token').nullable()
        tbl.string('firstname', 70).nullable().defaultTo('Не указано')
        tbl.string('middlename', 70).nullable().defaultTo('Не указано')
        tbl.string('lastname', 70).nullable().defaultTo('Не указано')
        tbl.integer('id_role').notNullable()

        
        tbl.foreign('id_role')
            .references('id').inTable('roles').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('users')
};
