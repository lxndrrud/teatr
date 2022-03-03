/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('sessions', tbl => {
        tbl.increments('id').primary()
        tbl.string('date').notNullable()
        tbl.string('time').notNullable()
        tbl.boolean('is_locked').notNullable().defaultTo(false)
        tbl.integer('id_play').notNullable()
            .references('id').inTable('plays')
        tbl.integer('id_price_policy').notNullable()
            .references('id').inTable('price_policies')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('sessions')
};
