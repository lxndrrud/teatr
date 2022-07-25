import React from 'react'
import styles from "./ReservationSlotItem.module.css"

function ReservationSlotItem({ slot }) {
    return (
        <li className={styles.slotItem} key={slot.id}>
            <p className={styles.textLabel}>
                <span className={styles.bold}>Название ряда:</span> {slot.row_title}
            </p>
            <p className={styles.textLabel}>
                <span className={styles.bold}>Номер ряда:</span> {slot.row_number}
            </p>
            <p className={styles.textLabel}>
                <span className={styles.bold}>Номер места:</span> {slot.seat_number}
            </p>
            <p className={styles.textLabel}>
                <span className={styles.bold}>Цена:</span> {slot.price} рублей
            </p>
        </li>
    )
}

export default ReservationSlotItem