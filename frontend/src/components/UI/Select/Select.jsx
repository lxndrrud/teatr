import React from 'react'
import styles from "./Select.module.css"

function Select({ children, styleClass, ...props }){
    let customStyleClass = `${styles.select}`
    if (styleClass) 
        customStyleClass = `${customStyleClass} ${styleClass}`
    return (
        <select {...props} className={customStyleClass} >
            { children }
        </select>
    )
}

export default Select