import React from 'react'
import styles from "./CustomInput.module.css"

const CustomInput = ({ description, ...props }) => {
  return (
    <>
      <p>{description}</p> 
      <input {...props } className={styles.customInput} />
    </>
    
  )
}

export default CustomInput