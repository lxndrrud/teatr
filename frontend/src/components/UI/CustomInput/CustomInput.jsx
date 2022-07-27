import React from 'react'
import styles from "./CustomInput.module.css"

function CustomInput({ description, inputStyleClass,  ...props }) {
    let customInputStyleClass = `${styles.customInput}`
    if (inputStyleClass) {
        customInputStyleClass = `${customInputStyleClass} ${inputStyleClass}`
    }
    return (
        <div className={styles.container}>
            <p>{description}</p> 
            <input {...props } className={customInputStyleClass} />
        </div>
      
    )
}

export default CustomInput