import React from 'react'
import ReservationItem from '../ReservationItem/ReservationItem'

function ReservationList({ reservations }) {
    return (
        <div className="mx-0 lg:ml-[5%] lg:w-[95%] 
                        flex flex-col lg:flex-row 
                        flex-wrap items-center sm:items-start" >
            {reservations && reservations.length > 0 
                ? 
                    reservations.map(reservation => (
                        <ReservationItem reservation={reservation} key={reservation.id} />
                    ))
                : 
                    <div className='flex flex-row justify-center items-center'>
                        Брони, удовлетворяющие Вашим условиям, не найдены...
                    </div>
            }
        </div>
    )
}

export default ReservationList