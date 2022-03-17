import React from 'react'
import styles from "./CustomInput.module.css"

const CustomInput = ({ description, errorMessage, inputStyleClass,  ...props }) => {
    let customInputStyleClass = `${styles.customInput}`
    if (inputStyleClass) {
        customInputStyleClass = `${customInputStyleClass} ${inputStyleClass}`
    }
    return (
        <div className={styles.container}>
            <p>{description}</p> 
            <p className={styles.errorMessage}>{errorMessage}</p>
            <input {...props } className={customInputStyleClass} />
        </div>
      
    )
}

export default CustomInput