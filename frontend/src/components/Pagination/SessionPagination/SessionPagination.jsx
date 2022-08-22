import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SessionList from '../../Sessions/SessionList/SessionList'
import PaginationButtons from '../PaginationButtons/PaginationButtons'

function SessionPagination({ itemsPerPage=6 }) {
    let sessions = useSelector(state => state.session.sessions)

    let [activePage, setActivePage] = useState(1)
    let [currentItems, setCurrentItems] = useState(null)
    let [lastPage, setLastPage] = useState(Math.ceil(sessions.length / itemsPerPage))
    useEffect(() => {
        if (sessions.length > 0) {
            let copy = sessions.length > itemsPerPage
                ? sessions.slice((activePage-1) * itemsPerPage, activePage * itemsPerPage)
                : sessions.slice()
            setCurrentItems(copy)
        }
    }, [sessions, activePage])
    return (
        <div className='w-[100%]'>
            <PaginationButtons 
                activePage={activePage} 
                setActivePage={setActivePage} 
                lastPage={lastPage} 
            />
            <SessionList sessions={currentItems} />
            <PaginationButtons 
                activePage={activePage} 
                setActivePage={setActivePage} 
                lastPage={lastPage} 
            />
        </div>
    )
}

export default SessionPagination