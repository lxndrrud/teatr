/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('auditoriums').del()
  await knex('auditoriums').insert([
    { 
      title: 'Главный зал', 
    },
    { 
      title: 'Малая сцена', 
    },
  ]);
};
