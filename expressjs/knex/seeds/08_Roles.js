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
            can_have_more_than_one_reservation_on_session: true,
            can_see_all_reservations: true,
            can_access_private: true,
            can_make_reservation_without_confirmation: true
        },
        {
            id: 9342,
            title: 'Кассир',
            can_have_more_than_one_reservation_on_session: true,
            can_see_all_reservations: true,
            can_access_private: false,
            can_make_reservation_without_confirmation: true
        },
        {
            id: 3,
            title: 'Посетитель',
            can_have_more_than_one_reservation_on_session: false,
            can_see_all_reservations: false,
            can_access_private: false,
            can_make_reservation_without_confirmation: false
        },
    ]);
};
  