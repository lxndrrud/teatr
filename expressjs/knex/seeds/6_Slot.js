/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('slots').del()
  await knex('slots').insert([
      {
        price: 200.0,
        id_seat: 1,
        id_price_policy: 1
      }
  ]);
};
