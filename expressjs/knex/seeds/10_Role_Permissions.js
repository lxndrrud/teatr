/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('roles_permissions').del();
    await knex('roles_permissions').insert([
        // Админ
        {
            id_role: 10034,
            id_permission: 1,
        },
        {
            id_role: 10034,
            id_permission: 2,
        },
        {
            id_role: 10034,
            id_permission: 3,
        },
        {
            id_role: 10034,
            id_permission: 4,
        },
        {
            id_role: 10034,
            id_permission: 5,
        },
        {
            id_role: 10034,
            id_permission: 6,
        },
        {
            id_role: 10034,
            id_permission: 8,
        },
        {
            id_role: 10034,
            id_permission: 9,
        },
        {
            id_role: 10034,
            id_permission: 10,
        },
        // Кассир
        {
            id_role: 9342,
            id_permission: 1,
        },
        {
            id_role: 9342,
            id_permission: 2,
        },
        {
            id_role: 9342,
            id_permission: 4,
        },
        {
            id_role: 9342,
            id_permission: 5,
        },
        {
            id_role: 9342,
            id_permission: 6,
        },
        {
            id_role: 9342,
            id_permission: 8,
        },
        {
            id_role: 9342,
            id_permission: 10,
        },
        // Посетитель
        {
            id_role: 3,
            id_permission: 6,
        },
        {
            id_role: 3,
            id_permission: 7
        }
    ]);
};
  