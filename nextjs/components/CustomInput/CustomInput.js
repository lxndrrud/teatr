import React from 'react'
import styles from "./CustomInput.module.css"

const CustomInput = ({ description, errorMessage, ...props }) => {
  return (
    <div className={styles.container}>
      <p>{description}</p> 
      <p className={styles.errorMessage}>{errorMessage}</p>
      <input {...props } className={styles.customInput} />
    </div>
    
  )
}

export default CustomInput