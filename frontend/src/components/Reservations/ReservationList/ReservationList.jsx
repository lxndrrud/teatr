import React from 'react'
import ReservationItem from '../ReservationItem/ReservationItem'
import styles from "./ReservationList.module.css"

function ReservationList({ reservations }) {
    return (
        <div className={styles.reservationList} >
            {reservations && reservations.length > 0 
                ? 
                    reservations.map(reservation => (
                        <ReservationItem reservation={reservation} key={reservation.id} />
                    ))
                : 
                    <div className='flex flex-row justify-center align-center'>
                        Брони, удовлетворяющие Вашим условиям, не найдены...
                    </div>
            }
        </div>
    )
}

export default ReservationList