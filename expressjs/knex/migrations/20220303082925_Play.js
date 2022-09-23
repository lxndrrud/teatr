/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('plays', tbl => {
        tbl.increments('id').primary()
        tbl.string('title', 100).notNullable()
        tbl.text('crew').nullable()
        tbl.text('description', 600).notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('plays')
};
