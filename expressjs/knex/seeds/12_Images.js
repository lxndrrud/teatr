/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('images').del();
    await knex('images').insert([
        {
            filepath: '/expressjs/storage/photos/photo1.jpg'
        },
        {
            filepath: '/expressjs/storage/photos/photo2.jpg'
        },
    ]);
};
  