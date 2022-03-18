import React from 'react'
import { useSelector } from 'react-redux'
import ReservationsItem from '../ReservationItem/ReservationItem'
import styles from "./ReservationList.module.css"

const ReservationList = () => {
    const reservations = useSelector(state => state.reservation.reservations)
    console.log(reservations)
    return (
        <div>
            {reservations && reservations.map(reservation => (
                    <ReservationsItem reservation={reservation} key={reservation.id} />
                ))
            }
        </div>
    )
}

export default ReservationList