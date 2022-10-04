import React, { useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { changePassword } from '../../../store/actions/userAction'
import BaseForm from "../BaseForm/BaseForm"
import CustomInput from "../../UI/CustomInput/CustomInput"
import CustomButton from '../../UI/CustomButton/CustomButton'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import swal from 'sweetalert2'
import { userReducer } from '../../../store/reducers/userReducer'


function UserEditPasswordForm() {
  const dispatch = useDispatch()
  const store = useStore()
  let { token } = useSelector(state => state.user)

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

    dispatch(changePassword({ token, passwordInfo: credentials }))
    const errorStore = store.getState().user.error
    if (!errorStore) {
      swal.fire({
        title: 'Пароль изменен!',
        icon: 'success',
        timer: 2000
      })
    } else {
      setError(errorStore)
      dispatch(userReducer.actions.errorSetDefault())
    }
   
  }
  return (
    <BaseForm>
      {
        error && <ErrorMessage text={error} />
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