/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('roles', tbl => {
        tbl.increments('id').primary()
        tbl.string('title').notNullable()
        tbl.boolean('can_see_all_reservations').notNullable()
        tbl.boolean('can_have_more_than_one_reservation_on_session').notNullable()
        tbl.boolean('can_access_private').notNullable()
        tbl.boolean('can_make_reservation_without_confirmation').notNullable()
        tbl.boolean('can_avoid_max_slots_property').notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('roles')
};
