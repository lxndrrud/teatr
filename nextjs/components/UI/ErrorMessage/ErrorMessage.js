import React from 'react'
import styles from "./ErrorMessage.module.css"

const ErrorMessage = ({ text }) => {
    return (
        <div className={styles.container}>
            <span className={styles.errorMessage}>{text}</span>
        </div>
    )
}

export default ErrorMessage