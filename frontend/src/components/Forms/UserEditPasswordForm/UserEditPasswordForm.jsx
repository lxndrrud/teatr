import React, { useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { changePassword, errorSetDefault, successSetDefault } from '../../../store/actions/userAction'
import styles from "./UserEditPasswordForm"
import BaseForm from "../BaseForm/BaseForm"
import CustomInput from "../../UI/CustomInput/CustomInput"
import CustomButton from '../../UI/CustomButton/CustomButton'
import SuccessMessage from '../../UI/SuccessMessage/SuccessMessage'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'


function UserEditPasswordForm() {
  const dispatch = useDispatch()
  const store = useStore()
  let token = useSelector(state => state.user.token)

  let [credentials, setCredentials] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  let [success, setSuccess] = useState(null)
  let [error, setError] = useState(null)

  function validate() {
    if (!credentials.oldPassword) {
      setError('Введите старый пароль')
      return false
    }
    else if (!credentials.newPassword) {
      setError('Введите новый пароль')
      return false
    }
    else if (!credentials.confirmPassword) {
      setError("Введите подтверждение нового пароля")
      return false
    }
    return true
  }

  function sendChangePasswordRequest(e) {
    e.preventDefault()

    if (!validate()) return

    setError(null)
    setSuccess(null)

    dispatch(changePassword(token, credentials))
    .then(() => {
      let successStore = store.getState().user.success,
        errorStore = store.getState().user.error
      if (!successStore && errorStore) setError(errorStore) 
      else if (!errorStore && successStore) setSuccess(successStore)
    })
    .then(dispatch(successSetDefault()))
    .then(dispatch(errorSetDefault()))
  }
  return (
    <BaseForm>
      {
        error && <ErrorMessage text={error} />
      }
      {
        success && <SuccessMessage text={success} />
      }
      <CustomInput 
        type="password"
        description="Старый пароль" 
        required
        onChange={(e) => { setCredentials({...credentials, oldPassword: e.target.value })}} />
      <CustomInput 
        type="password"
        description="Новый пароль"
        required
        onChange={(e) => { setCredentials({...credentials, newPassword: e.target.value })}} />
      <CustomInput 
        type="password"
        description="Повторите новый пароль" 
        required
        onChange={(e) => { 
            setCredentials({...credentials, confirmPassword: e.target.value })
          }} />
      <CustomButton type="submit"
        value='Сохранить' onClickHook={sendChangePasswordRequest} />
    </BaseForm>
  )
}

export default UserEditPasswordForm