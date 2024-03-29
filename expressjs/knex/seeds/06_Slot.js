/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  let slots = []
  for (let i = 1; i < 25; i++) {
    slots.push({
      price: 200.0,
      id_seat: i,
      id_price_policy: 1
    })
  }
  await knex('slots').del()
  await knex('slots').insert(slots);
};
