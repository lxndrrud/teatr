/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('roles').del();
    await knex('roles').insert([
        {
            id: 10034,
            title: 'Администратор',
        },
        {
            id: 9342,
            title: 'Кассир',
            
        },
        {
            id: 3,
            title: 'Посетитель',
        },
        {
            id: 4,
            title: 'Заблокированный пользователь'
        }
    ]);
};
  