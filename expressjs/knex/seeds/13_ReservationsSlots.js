/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('reservations_slots').del();
    await knex('reservations_slots').insert([
        {
            id_slot: 1,
            id_reservation: 1
        },
        {
            id_slot: 2,
            id_reservation: 1
        },
        {
            id_slot: 3,
            id_reservation: 2
        },
        {
            id_slot: 123,
            id_reservation: 123
        },
        {
            id_slot: 124,
            id_reservation: 123
        },
        {
            id_slot: 125,
            id_reservation: 123
        },
    ]);
};
  