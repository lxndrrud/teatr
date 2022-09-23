import React from 'react'

function DetailImage({ filepath, altDescription }) {
    return (
        <img className="max-w-[400px] h-[auto] rounded" 
            src={filepath} alt={altDescription} />
    )
}

export default DetailImage