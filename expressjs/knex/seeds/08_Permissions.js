/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('permissions').del();
    await knex('permissions').insert([
        {
            title: 'Иметь больше одной брони на сеанс',
            code: 'ИМЕТЬ_БОЛЬШЕ_ОДНОЙ_БРОНИ',
        },
        {
            title: 'Видеть все брони',
            code: 'ВИДЕТЬ_ВСЕ_БРОНИ',
        },
        {
            title: 'Удалять чужие брони',
            code: 'УДАЛЯТЬ_ЧУЖИЕ_БРОНИ',
        },
        {
            title: 'Бронировать без подтверждения по почте',
            code: 'БРОНЬ_БЕЗ_ПОДТВЕРЖДЕНИЯ',
        },
        {
            title: 'Игнорировать ограничение сеанса для брони на максимум мест',
            code: 'ИГНОР_МАКС_МЕСТ_СЕАНСА',
        },
        {
            title: 'Создавать брони',
            code: 'СОЗД_БРОНИ'
        },
        {
            title: 'Восстанавливать пароль по почте',
            code: 'ВОССТ_ПАРОЛЬ_ПО_ПОЧТЕ'
        }
    ]);
};
  