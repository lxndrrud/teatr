/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('rows').del()
    let rows = []

    // Главный зал
    for (let i=1; i < 17; i++) {
        rows.push({
            number: i,
            title: 'Партер',
            id_auditorium: 1
        })
    }

    rows.push({
        number: 1,
        title: 'Балкон (Левое крыло)',
        id_auditorium: 1
    })

    rows.push({
        number: 1,
        title: 'Балкон (Правое крыло)',
        id_auditorium: 1
    })

    for (let i=1; i<5; i++) {
        rows.push({
            number: i,
            title: 'Балкон (Средняя часть)',
            id_auditorium: 1
        })
    }

    // Малый зал
    for (let i = 1; i < 11; i++) {
        rows.push({
            number: i,
            title: 'Партер (Первый сектор)',
            id_auditorium: 2,
        })
    }

    for (let i = 11; i < 15; i++) {
        rows.push({
            number: i,
            title: 'Партер (Второй сектор)',
            id_auditorium: 2,
        })
    }
    await knex('rows').insert(rows);
};
