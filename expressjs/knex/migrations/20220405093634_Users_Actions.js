/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('user_actions', tbl => {
        tbl.increments('id').primary()
        tbl.integer('id_user').notNullable()
        tbl.text('description').notNullable()
        tbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now())

        tbl.foreign('id_user')
            .references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('user_actions')
};
