/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('sessions', tbl => {
        tbl.increments('id').primary()
        tbl.timestamp('timestamp').notNullable().unique()
        tbl.boolean('is_locked').notNullable().defaultTo(false)
        tbl.integer('max_slots').notNullable().defaultTo(5)
        tbl.integer('id_play').notNullable()
        tbl.integer('id_price_policy').notNullable()

        
        tbl.foreign('id_play')
            .references('id').inTable('plays').onDelete('CASCADE').onUpdate('CASCADE')
        tbl.foreign('id_price_policy')
            .references('id').inTable('price_policies').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('sessions')
};
