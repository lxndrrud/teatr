/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('rows', tbl => {
        tbl.increments('id').primary()
        tbl.integer('number').notNullable()
        tbl.string('title', 50).notNullable()
        tbl.integer('id_auditorium').notNullable()

        tbl.foreign('id_auditorium')
            .references('id').inTable('auditoriums').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('rows')
};
