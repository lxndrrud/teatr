import React from 'react'
import styles from './CustomButton.module.css'

const CustomButton = ({ onClickHook, styleClass, ...props }) => {
    let customStyleClass = `${styles.customButton}`
    if (styleClass)
        customStyleClass = `${customStyleClass} ${styleClass}`
    return (
        <input {... props } onClick={ onClickHook } className={ customStyleClass } />
    )
}

export default CustomButton