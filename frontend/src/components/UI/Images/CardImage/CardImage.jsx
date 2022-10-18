import React from 'react'

function CardImage({ filepath, altDescription }) {
    return (
        <img className="w-[200px] h-[250px] rounded" 
            src={filepath} alt={altDescription} />
    )
}

export default CardImage