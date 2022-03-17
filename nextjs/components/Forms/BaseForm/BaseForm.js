import React from 'react'
import styles from "./BaseForm.module.css"

const BaseForm = ({ children, styleClass }) => {
  let customStyleClass = `${styles.formContainer}`
  if (styleClass)
    customStyleClass = `${customStyleClass} ${styleClass}`
  return (
    <form className={customStyleClass}>
        { children }
    </form>
  )
}

export default BaseForm