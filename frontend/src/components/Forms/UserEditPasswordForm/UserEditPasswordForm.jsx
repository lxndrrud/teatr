import React, { useState } from 'react'
import styles from "./UserEditPasswordForm"
import BaseForm from "../BaseForm/BaseForm"
import CustomInput from "../../UI/CustomInput/CustomInput"
import CustomButton from '../../UI/CustomButton/CustomButton'


function UserEditPasswordForm() {
  let [credentials, setCredentials] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  return (
    <BaseForm>
      <CustomInput description="Старый пароль" 
        onChange={(e) => { setCredentials({...credentials, oldPassword: e.target.value })}} />
      <CustomInput description="Новый пароль"
        onChange={(e) => { setCredentials({...credentials, newPassword: e.target.value })}} />
      <CustomInput description="Повторите новый пароль" 
        onChange={(e) => { setCredentials({...credentials, confirmPassword: e.target.value })}} />
      <CustomButton type="submit"
        value='Сохранить' onClickHook={(e) => {
          e.preventDefault()
          console.log(credentials) }} />
    </BaseForm>
  )
}

export default UserEditPasswordForm