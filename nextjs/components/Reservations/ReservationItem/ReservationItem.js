import React from 'react'
import styles from "./ReservationItem.module.css"
import { ButtonLink } from '../../UI/ButtonLink/ButtonLink'

const ReservationsItem = ({ reservation }) => {
    const destinationURL = `/reservation/${reservation.id}`

    // <p className={styles.slotsQuantity}>{reservation.slots.length}</p>
    return (
        <div className={styles.reservationItem}>
            <p className={styles.playTitle}>{reservation.play_title}</p>
            <p className={styles.auditoriumTitle}>{reservation.auditorium_title}</p>
            <p className={styles.sessionTimestamp}>{reservation.session_timestamp}</p>
            <ButtonLink destination={destinationURL} text="Оформить бронь"/> 
        </div>
    )
}

export default ReservationsItem