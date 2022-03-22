import React from 'react'
import styles from "./ReservationSlotItem.module.css"

const ReservationSlotItem = ({ slot }) => {
    return (
        <li className={styles.slotItem} key={slot.id}>
            <p className={styles.rowTitle}>Название ряда: {slot.row_title}</p>
            <p className={styles.rowNumber}>Номер ряда: {slot.row_number}</p>
            <p className={styles.seatNumber}>Номер места: {slot.seat_number}</p>
            <p className={styles.price}>Цена: {slot.price} рублей</p>
        </li>
    )
}

export default ReservationSlotItem