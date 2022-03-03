/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('price_policies').del()
  await knex('price_policies').insert([
    {
      title: 'Тестовая ценовая политиsка'
    }
  ]);
};
