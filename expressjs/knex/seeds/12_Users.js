/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users').del();
    await knex('users').insert([
        {
            password: 'hashed_pass',
            id_record: 1,
            id_role: 1
        }
    ]);
};
  