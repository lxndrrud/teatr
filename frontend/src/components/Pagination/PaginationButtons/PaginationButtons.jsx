import React from 'react'

function PaginationButtons({ activePage, setActivePage, lastPage }) {
    return (
        <div className='flex flex-row justify-center [@media(max-width:340px)]:justify-start my-3'>
            <button className="flex sm:px-2 text-[#ae2876] rounded-full disabled:opacity-75" 
                onClick={() => setActivePage(1)} disabled={activePage===1} >
                {'<<'}
            </button>
            <button className="flex sm:px-2 ml-1 text-[#ae2876] rounded-full disabled:opacity-75" 
                onClick={() => setActivePage(activePage-1)} disabled={activePage===1} >
                {'<'}
            </button>
            <span className='py-1 mx-2'>{activePage}&nbsp;из&nbsp;{lastPage}</span>
            <button className="flex sm:px-2 mr-1 text-[#ae2876] rounded-full disabled:opacity-75"
                onClick={() => setActivePage(activePage+1)} disabled={activePage===lastPage}  >
                {'>'}
            </button>
            <button className="flex sm:px-2 text-[#ae2876] rounded-full disabled:opacity-75"
                onClick={() => setActivePage(lastPage)} disabled={activePage===lastPage}  >
                {'>>'}
            </button>
        </div>
    )
}

export default PaginationButtons