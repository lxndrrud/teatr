/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('images').del();
    await knex('images').insert([
        {
            filepath: '/storage/photos/antrakt.jpg'
        },
        {
            filepath: '/storage/photos/ledi.jpg'
        },
    ]);
};
  