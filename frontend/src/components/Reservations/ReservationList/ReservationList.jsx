import React from 'react'
import ReservationItem from '../ReservationItem/ReservationItem'

function ReservationList({ reservations }) {
    return (
        <div className="lg:ml-[1%] w-[99%] 
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