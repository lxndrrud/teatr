import React from 'react'

function CustomExternalLink({ destination, text }) {
    return (
        <a href={destination} target="_blank" className="p-0 m-0 text-[inherit] text-[purple] hover:underline">{text}</a>
    )
}

export default CustomExternalLink