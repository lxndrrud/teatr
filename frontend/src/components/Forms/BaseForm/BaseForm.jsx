import React from 'react'
import styles from "./BaseForm.module.css"

function BaseForm({ children, styleClass }) {
    let customStyleClass = `${styles.formContainer}`
    if (styleClass)
        customStyleClass = `${customStyleClass} ${styleClass}`
    return (
        <form className={customStyleClass}>
            <div className={styles.itemsContainer}>
                { children }
            </div>
        </form>
    )
}

export default BaseForm