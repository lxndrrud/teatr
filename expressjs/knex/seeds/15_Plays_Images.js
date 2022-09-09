/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('plays_images').del();
    await knex('plays_images').insert([
        {
            id_play: 1,
            id_image: 1,
            is_poster: true,
        },
        {
            id_play: 2,
            id_image: 2,
            is_poster: true,
        },
    ]);
};
  