/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('roles', tbl => {
        tbl.increments('id').primary()
        tbl.string('title').notNullable()
        tbl.boolean('can_access_private').notNullable()
        tbl.boolean('can_make_reservation_without_email').notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('roles')
};
