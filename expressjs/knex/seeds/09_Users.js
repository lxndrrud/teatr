/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users').del();
    await knex('users').insert([
        {
            // '123456'
            password: '$2a$10$.7sVPajSPR/JTa4g8tWToe7O31A0Gz4EnL6TA8BzMaD8IAxXbFqwS',
            firstname: 'Тест',
            email: 'lxndrrud@yandex.ru',
            id_role: 3
        }, 
        {
            // '123456'
            password: '$2a$10$.7sVPajSPR/JTa4g8tWToe7O31A0Gz4EnL6TA8BzMaD8IAxXbFqwS',
            firstname: 'Тест',
            email: 'kassir@mail.ru',
            id_role: 9342
        },
        {
            // '123456'
            password: '$2a$10$.7sVPajSPR/JTa4g8tWToe7O31A0Gz4EnL6TA8BzMaD8IAxXbFqwS',
            firstname: 'Админ',
            email: 'admin@admin.ru',
            id_role: 10034
        }
    ]);
};
  