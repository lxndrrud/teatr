import React from 'react'

function PaginationButtons({ activePage, setActivePage, lastPage }) {
    return (
        <div className='flex flex-row justify-center my-3'>
            <button className="p-1 font-['Montserrat'] flex sm:px-2 text-[#ae2876] rounded-full disabled:text-[lightslategray]" 
                onClick={() => setActivePage(1)} disabled={activePage===1} >
                {'<<'}
            </button>
            <button className="p-1 font-['Montserrat'] flex sm:px-2 ml-1 text-[#ae2876] rounded-full disabled:text-[lightslategray]" 
                onClick={() => setActivePage(activePage-1)} disabled={activePage===1} >
                {'<'}
            </button>
            <span className='py-1 mx-2'>{activePage}&nbsp;из&nbsp;{lastPage}</span>
            <button className="p-1 font-['Montserrat'] flex sm:px-2 mr-1 text-[#ae2876] rounded-full disabled:text-[lightslategray]"
                onClick={() => setActivePage(activePage+1)} disabled={activePage===lastPage}  >
                {'>'}
            </button>
            <button className="p-1 font-['Montserrat'] flex sm:px-2 text-[#ae2876] rounded-full disabled:text-[lightslategray]"
                onClick={() => setActivePage(lastPage)} disabled={activePage===lastPage}  >
                {'>>'}
            </button>
        </div>
    )
}

export default PaginationButtons