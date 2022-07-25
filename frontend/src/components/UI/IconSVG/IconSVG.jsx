import React from 'react'
import styles from "./IconSVG.module.css"

function IconSVG({ data, height="24px", width="24px", viewBox="0 0 24 24", color="#000" }) {
    /*

     viewBox: "0 0 24 24"
    */
    return (
        <svg style={{height, width}} viewBox={viewBox} className={styles.icon} >
            <path fill={color} d={data} />
        </svg>
    )
}

export default IconSVG