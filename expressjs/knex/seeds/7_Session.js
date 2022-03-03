/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('sessions').del()
  await knex('sessions').insert([
    {
      id_play: 1,
      is_locked: false,
      date: '15.03.2022',
      time:'10:30',
      id_price_policy: 1
    }
  ]);
};
