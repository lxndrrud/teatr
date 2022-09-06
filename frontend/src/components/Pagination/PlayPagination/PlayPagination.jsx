import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PaginationButtons from '../PaginationButtons/PaginationButtons'
import PlayList from '../../Plays/PlayList/PlayList'

function PlayPagination({ itemsPerPage=6 }) {
    let plays = useSelector(state => state.play.plays)

    let [activePage, setActivePage] = useState(1)
    let [currentItems, setCurrentItems] = useState(null)
    let [lastPage, setLastPage] = useState(plays && plays.length > 0 
        ? 
            Math.ceil(plays.length / itemsPerPage)
        : 
            1)

    useEffect(() => {
        setActivePage(1)
    }, [plays])
    useEffect(() => {
        setLastPage(
            plays && plays.length > 0 
                ? 
                    Math.ceil(plays.length / itemsPerPage)
                : 
                    1
        )
        if (plays.length > 0) {
            let copy = plays.length > itemsPerPage
                ? plays.slice((activePage-1) * itemsPerPage, activePage * itemsPerPage)
                : plays.slice()
            setCurrentItems(copy)
        } else {
            setCurrentItems([])
        }
    }, [plays, activePage])
    return (
        <div className='w-[100%]'>
            <PaginationButtons 
                activePage={activePage}
                setActivePage={setActivePage}
                lastPage={lastPage}
            />
            <PlayList plays={currentItems} />
            <PaginationButtons 
                activePage={activePage}
                setActivePage={setActivePage}
                lastPage={lastPage}
            />
        </div>
    )
}

export default PlayPagination