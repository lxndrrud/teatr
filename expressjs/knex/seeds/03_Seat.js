/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    let seats = []
    // Большой зал партер
    for (let row = 1; row < 17; row++) {
        if (row < 15) {
            for (let seat = 1; seat < 25; seat++ ) {
                seats.push({
                    number: seat,
                    id_row: row
                })
            }
        }
        else if (row === 15) {
            for (let seat = 1; seat < 23; seat++ ) {
                seats.push({
                    number: seat,
                    id_row: row
                })
            }
        }
        else if (row === 16) {
            for (let seat = 1; seat < 21; seat++ ) {
                seats.push({
                    number: seat,
                    id_row: row
                })
            }
        }
    }

    // Большой зал левая и правая части балкона
    for (let row = 17; row < 19; row ++) {
        for (let seat = 1; seat < 10; seat++ ) {
            seats.push({
                number: seat,
                id_row: row
            })
        }
    }

    // Средняя часть балкона
    for (let row = 19; row < 23; row ++) {
        if (row < 22) {
            for (let seat = 1; seat < 25; seat++ ) {
                seats.push({
                    number: seat,
                    id_row: row
                })
            }
        }
        else {
            for (let seat = 1; seat < 31; seat++ ) {
                seats.push({
                    number: seat,
                    id_row: row
                })
            }
        }
    }


    
    await knex('seats').del()
    await knex('seats').insert(seats);
};
