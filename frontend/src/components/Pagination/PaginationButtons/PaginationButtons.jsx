import React from 'react'

function PaginationButtons({ activePage, setActivePage, lastPage }) {
    return (
        <div className='flex flex-row justify-center my-3'>
            <button className="flex py-1 px-3 border-solid border-2 border-black bg-[#ae2876] rounded-full disabled:opacity-75" 
                onClick={() => setActivePage(1)} disabled={activePage===1} >
                {'<<'}
            </button>
            <button className="flex py-1 px-3 ml-1 border-solid border-2 border-black bg-[#ae2876] rounded-full disabled:opacity-75" 
                onClick={() => setActivePage(activePage-1)} disabled={activePage===1} >
                {'<'}
            </button>
            <span className='py-1 mx-2'>{activePage} из {lastPage}</span>
            <button className="flex py-1 px-3 mr-1 border-solid border-2 border-black bg-[#ae2876] rounded-full disabled:opacity-75"
                onClick={() => setActivePage(activePage+1)} disabled={activePage===lastPage}  >
                {'>'}
            </button>
            <button className="flex py-1 px-3 border-solid border-2 border-black bg-[#ae2876] rounded-full disabled:opacity-75"
                onClick={() => setActivePage(lastPage)} disabled={activePage===lastPage}  >
                {'>>'}
            </button>
        </div>
    )
}

export default PaginationButtons