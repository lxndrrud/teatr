/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('plays_images', tbl => {
        tbl.increments('id').primary()
        tbl.integer('id_play').notNullable()
            .references('id').inTable('plays')
        tbl.integer('id_image').notNullable()
            .references('id').inTable('images')
        tbl.boolean('is_poster').notNullable().defaultTo(true)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('plays_images')
};
