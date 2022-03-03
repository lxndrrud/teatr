/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('rows').del()
  await knex('rows').insert([
    {
      number: 1,
      title: 'Партер',
      id_auditorium: 1
    }
  ]);
};
