import React from 'react'
import styles from './CustomButton.module.css'

const CustomButton = ({ onClickHook, ...props }) => {
  return (
    <input {... props } onClick={ onClickHook } className={ styles.customButton }/>
  )
}

export default CustomButton