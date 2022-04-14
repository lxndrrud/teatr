/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('plays_images', tbl => {
        tbl.increments('id').primary()
        tbl.integer('id_play').notNullable()
        tbl.integer('id_image').notNullable()
        tbl.boolean('is_poster').notNullable().defaultTo(true)


        tbl.foreign('id_play')
            .references('id').inTable('plays').onDelete('CASCADE').onUpdate('CASCADE')

        tbl.foreign('id_image')
            .references('id').inTable('images').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('plays_images')
};
