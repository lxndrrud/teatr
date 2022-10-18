import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReservationList from '../../Reservations/ReservationList/ReservationList'
import PaginationButtons from '../PaginationButtons/PaginationButtons'

function ReservationPagination({ itemsPerPage=6 }) {
    const reservations = useSelector(state => state.reservation.reservations)

    let [activePage, setActivePage] = useState(1)
    let [currentItems, setCurrentItems] = useState(null)
    let [lastPage, setLastPage] = useState(
        reservations && reservations.length > 0 
            ? 
                Math.ceil(reservations.length / itemsPerPage)
            : 
                1)
    useEffect(() => {
        setActivePage(1)
    }, [reservations])
    useEffect(() => {
        setLastPage(
        reservations && reservations.length > 0 
            ? 
                Math.ceil(reservations.length / itemsPerPage)
            : 
                1)
        if (reservations.length > 0) {
            let copy = reservations.length > itemsPerPage
                ? reservations.slice((activePage-1) * itemsPerPage, activePage * itemsPerPage)
                : reservations.slice()
            setCurrentItems(copy)
        } else {
            setCurrentItems([])
        }
    }, [reservations, activePage])
    return (
        <div className='w-screen sm:w-[100%]'>
            <PaginationButtons 
                activePage={activePage}
                setActivePage={setActivePage}
                lastPage={lastPage}
            />
            <ReservationList reservations={currentItems} />
            <PaginationButtons 
                activePage={activePage}
                setActivePage={setActivePage}
                lastPage={lastPage}
            />
        </div>
    )
}

export default ReservationPagination