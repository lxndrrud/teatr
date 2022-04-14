/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    let slots = []

    // Главный зал
    for (let i = 1; i < 499; i++) {
        slots.push({
            price: 200.0,
            id_seat: i,
            id_price_policy: 1
        })
    }

    // Малая сцена
    for (let i = 499; i < 655; i++) {
        slots.push({
            price: 300.0,
            id_seat: i,
            id_price_policy: 2
        })
    }
    await knex('slots').del()
    await knex('slots').insert(slots);
};
