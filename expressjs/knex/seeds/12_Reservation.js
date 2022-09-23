/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('reservations').del()
    await knex('reservations').insert([
        {
            is_paid: false,
            is_confirmed: false,
            //code: '123456',
            confirmation_code: '123456',
            id_session: 2,
            id_user: 1
        },
        {
            is_paid: false,
            is_confirmed: true,
            //code: '123456',
            confirmation_code: '123456',
            id_session: 3,
            id_user: 2
        },

        {
            id: 123,
            is_paid: true,
            is_confirmed: true,
            //code: '123456',
            confirmation_code: '123456',
            id_session: 2,
            id_user: 3
        },
    ]);
};
  