/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('roles').del();
    await knex('roles').insert([
        {
            title: 'Админ',
            can_access_private: true,
            can_make_reservation_without_email: true
        },
        {
            title: 'Кассир',
            can_access_private: true,
            can_make_reservation_without_email: true
        },
        {
            title: 'Посетитель',
            can_access_private: false,
            can_make_reservation_without_email: false
        },
    ]);
};
  