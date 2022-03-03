/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('plays').del()
  await knex('plays').insert([
    {
      title: 'Спектакль 1',
      description: 'Тестовый спектакль 1'
    },
    {
      title: 'Спектакль 2',
      description: 'Тестовый спектакль 2'
    }
  ]);
};
