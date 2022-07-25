import React from 'react'
import styles from "./ErrorMessage.module.css"

function ErrorMessage ({ text }) {
    return (
        <div className={styles.container}>
            <span className={styles.errorMessage}>{text}</span>
        </div>
    )
}

export default ErrorMessage