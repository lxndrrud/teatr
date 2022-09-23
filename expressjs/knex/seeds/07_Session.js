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
      timestamp: '2022-10-15T23:00+0300',
      id_price_policy: 1
    },
    {
      id_play: 1,
      is_locked: false,
      timestamp: '2022-10-20T08:30+0300',
      id_price_policy: 1
    },
    {
      id_play: 2,
      is_locked: false,
      timestamp: '2022-10-21T07:30+0300',
      id_price_policy: 2
    },
    {
      id_play: 2,
      is_locked: false,
      timestamp: '2022-10-22T08:30+0300',
      id_price_policy: 1
    }
  ]);
};
