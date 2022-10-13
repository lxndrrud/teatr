import React from 'react'
import { useSelector } from 'react-redux'
import Preloader from '../../UI/Preloader/Preloader'
import ReservationItem from '../ReservationItem/ReservationItem'

function ReservationList({ reservations }) {
    let isLoading = useSelector(state => state.reservation.isLoading)
    return (
        <div className="mx-0 lg:ml-[5%] lg:w-[95%] 
                        flex flex-col lg:flex-row 
                        flex-wrap items-center sm:items-start" >
            {
                isLoading
                ?
                    <Preloader />
                
                :
                    (reservations && reservations.length > 0 
                        ? 
                            reservations.map(reservation => (
                                <ReservationItem reservation={reservation} key={reservation.id} />
                            ))
                        : 
                            <div className='flex flex-row justify-center items-center'>
                                Брони, удовлетворяющие Вашим условиям, не найдены...
                            </div>)
            }
        </div>
    )
}

export default ReservationList