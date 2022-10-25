import React from 'react'

function CardImage({ filepath, altDescription }) {
    return (
        <img className="min-w-[200px] w-[200px] h-[250px] rounded" 
            src={filepath} alt={altDescription} />
    )
}

export default CardImage