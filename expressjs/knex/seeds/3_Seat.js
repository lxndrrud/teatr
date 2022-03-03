/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('seats').del()
  await knex('seats').insert([
    {
      number: 1,
      id_row: 1
    },
    {
      number: 2,
      id_row: 1
    },
    {
      number: 3,
      id_row: 1
    },{
      number: 4,
      id_row: 1
    },{
      number: 5,
      id_row: 1
    },{
      number: 6,
      id_row: 1
    },{
      number: 7,
      id_row: 1
    },{
      number: 8,
      id_row: 1
    },{
      number: 9,
      id_row: 1
    },{
      number: 10,
      id_row: 1
    },{
      number: 11,
      id_row: 1
    },{
      number: 12,
      id_row: 1
    },{
      number: 13,
      id_row: 1
    },{
      number: 14,
      id_row: 1
    },{
      number: 15,
      id_row: 1
    },{
      number: 16,
      id_row: 1
    },
  ]);
};
