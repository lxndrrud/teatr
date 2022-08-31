import React from 'react'
import styles from './CustomButton.module.css'

function CustomButton({ onClickHook, buttonType, value}) {
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
    //<input {... props } onClick={ onClickHook } className={ fetchStyle(buttonType) } />
    return (
        
        <button onClick={ onClickHook } className={ fetchStyle(buttonType) }>
            {value}
        </button>
    )
}

export default CustomButton