import React from 'react'
import { useSelector } from 'react-redux'
import ReservationItem from '../ReservationItem/ReservationItem'
import styles from "./ReservationList.module.css"

function ReservationList({ reservations }) {
    return (
        <div className={styles.reservationList} >
            {reservations && reservations.length > 0 && reservations.map(reservation => (
                    <ReservationItem reservation={reservation} key={reservation.id} />
                ))
            }
        </div>
    )
}

export default ReservationList