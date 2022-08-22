import React from 'react'

function PaginationButtons({ activePage, setActivePage, lastPage }) {
    return (
        <div className='flex flex-row justify-center'>
            <button className="flex p-3 border-solid border-1 border-black bg-[#ae2876]" 
                onClick={() => setActivePage(activePage-1)} disabled={activePage===1} >
                {'<'}
            </button>
            <button className="" 
                onClick={() => setActivePage(activePage+1)} disabled={activePage===lastPage}  >
                {'>'}
            </button>
        </div>
    )
}

export default PaginationButtons