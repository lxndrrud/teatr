/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('roles').del();
    await knex('roles').insert([
        {
            id: 10034,
            title: 'Администратор',
            can_access_private: true,
            can_make_reservation_without_email: true
        },
        {
            id: 9342,
            title: 'Кассир',
            can_access_private: true,
            can_make_reservation_without_email: true
        },
        {
            id: 3,
            title: 'Посетитель',
            can_access_private: false,
            can_make_reservation_without_email: false
        },
    ]);
};
  