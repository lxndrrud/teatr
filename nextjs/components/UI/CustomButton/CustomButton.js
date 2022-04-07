import React from 'react'
import styles from './CustomButton.module.css'

const CustomButton = ({ onClickHook, buttonType, ...props }) => {
    const fetchStyle = (type) => {
        const red = styles.red,
        blue = styles.blue,
        green = styles.green,
        customButton = styles.customButton

    switch (type) {
        case "red":
            return `${customButton} ${red}`
        case "green":
            return `${customButton} ${green}`
        case "blue":
            return `${customButton} ${blue}`
        default:
            return `${customButton} ${blue}`
    }
    }
    return (
        <input {... props } onClick={ onClickHook } className={ fetchStyle(buttonType) } />
    )
}

export default CustomButton