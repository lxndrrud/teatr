import React from 'react'
import styles from "./SuccessMessage.module.css"

function SuccessMessage({ text }) {
    return (
        <div className={styles.container}>
            <span className={styles.successMessage}>
                {text}
            </span>
        </div>
    )
}

export default SuccessMessage