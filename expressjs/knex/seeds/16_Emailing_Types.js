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
            resend_interval: 60 * 2,
            repeat_interval: 0,
            repeatable: false,
        }, 
        {
            title: 'Восстановление пароля',
            resend_interval: 60 * 2,
            repeat_interval: 60 * 15,
            repeatable: true
        }
    ]);
};
  