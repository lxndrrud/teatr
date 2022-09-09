/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.withSchema('public').createTable('roles_permissions', tbl => {
        tbl.increments('id').primary()
        tbl.integer('id_role').notNullable().unsigned()
        tbl.integer('id_permission').notNullable().unsigned()

        tbl.foreign('id_role')
            .references('id').inTable('roles').onDelete('CASCADE').onUpdate('CASCADE')

        tbl.foreign('id_permission')
            .references('id').inTable('permissions').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists('roles_permissions')
};
