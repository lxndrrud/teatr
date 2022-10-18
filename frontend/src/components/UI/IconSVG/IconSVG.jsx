import React from 'react'

function IconSVG({ data, height="24px", width="24px", viewBox="0 0 24 24", color="#000" }) {
    /*

     viewBox: "0 0 24 24"
    */
    return (
        <svg style={{height, width}} viewBox={viewBox} className="float-left" >
            <path fill={color} d={data} />
        </svg>
    )
}

export default IconSVG