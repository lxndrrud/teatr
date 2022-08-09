import React from 'react'

function PaginationButtons({ activePage, setActivePage, lastPage }) {
    return (
        <div className='flex flex-row justify-center'>
            <button onClick={() => setActivePage(activePage-1)} disabled={activePage===1} >
                {'<'}
            </button>
            <button onClick={() => setActivePage(activePage+1)} disabled={activePage===lastPage}  >
                {'>'}
            </button>
        </div>
    )
}

export default PaginationButtons