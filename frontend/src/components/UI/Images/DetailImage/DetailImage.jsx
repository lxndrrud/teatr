import React from 'react'

function DetailImage({ filepath, altDescription }) {
    return (
        <img className="w-[95%] md:w-[400px] h-[auto] rounded" 
            src={filepath} alt={altDescription} />
    )
}

export default DetailImage