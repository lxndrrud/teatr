import React from 'react'
import styles from "./InputDate.module.css"

function InputDate({ children, onChange, styleClass, ...props }) {
    let customStyleClass = `${styles.inputDate}`
    if (styleClass) 
        customStyleClass = `${customStyleClass} ${styleClass}`
    return (
        <input {...props} 
            lang="ru-RU"
            type="date"
            onChange={onChange} 
            className={customStyleClass} >
            { children }
        </input>
    )
}

export default InputDate