import React from 'react'
import styles from "./CustomInput.module.css"

const CustomInput = ({ description, errorMessage, ...props }) => {
  return (
    <>
      <p>{description}</p> 
      <p className={styles.errorMessage}>{errorMessage}</p>
      <input {...props } className={styles.customInput} />
    </>
    
  )
}

export default CustomInput