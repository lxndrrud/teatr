import React from 'react'
import styles from "./BaseForm.module.css"

const BaseForm = ({ children }) => {
  return (
    <form className={styles.formContainer}>
        { children }
    </form>
  )
}

export default BaseForm