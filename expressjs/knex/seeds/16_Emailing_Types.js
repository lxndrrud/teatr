/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('emailing_types').del();
    await knex('emailing_types').insert([
        {
            title: 'Создание брони',
            interval: 60 * 3,
            repeatable: true,
        }, 
        {
            title: 'Восстановление пароля',
            interval: 60 * 60 * 24,
            repeatable: true
        }
    ]);
};
  