/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  let seats = []
  for (let i = 1; i < 25; i++ ) {
    seats.push({
      number: i,
      id_row: 1
    })
  }

  await knex('seats').del()
  await knex('seats').insert(seats);
};
