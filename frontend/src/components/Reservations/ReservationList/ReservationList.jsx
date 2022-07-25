import React from 'react'
import { useSelector } from 'react-redux'
import ReservationItem from '../ReservationItem/ReservationItem'
import styles from "./ReservationList.module.css"

function ReservationList() {
    const reservations = useSelector(state => state.reservation.reservations)
    
    return (
        <div className={styles.reservationList} >
            {reservations && reservations.map(reservation => (
                    <ReservationItem reservation={reservation} key={reservation.id} />
                ))
            }
        </div>
    )
}

export default ReservationList