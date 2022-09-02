import React from 'react'
import ReservationItem from '../ReservationItem/ReservationItem'

function ReservationList({ reservations }) {
    return (
        <div className="[@media(min-width:1250px)]:ml-[2%] w-[98%] flex flex-col [@media(min-width:1250px)]:flex-row 
                        flex-wrap" >
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