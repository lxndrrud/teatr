import React, { useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { changePassword } from '../../../store/actions/userAction'
import BaseForm from "../BaseForm/BaseForm"
import CustomInput from "../../UI/CustomInput/CustomInput"
import CustomButton from '../../UI/CustomButton/CustomButton'
import { userReducer } from '../../../store/reducers/userReducer'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'


function UserEditPasswordForm() {
  const dispatch = useDispatch()
  const store = useStore()
  const navigate = useNavigate()
  let { token } = useSelector(state => state.user)

  let [credentials, setCredentials] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  function validate() {
    if (!credentials.oldPassword) {
      Swal.fire({
          title: 'Ошибка!',
          text: 'Введите старый пароль',
          icon: "warning"
      })
      return false
    }
    else if (!credentials.newPassword) {
      Swal.fire({
        title: 'Ошибка!',
        text: 'Введите новый пароль',
        icon: "warning"
      })
      return false
    }
    else if (!credentials.confirmPassword) {
      Swal.fire({
        title: 'Ошибка!',
        text: "Введите подтверждение нового пароля",
        icon: "warning"
      })
      return false
    }
    return true
  }

  async function sendChangePasswordRequest(e) {
      e.preventDefault()

      if (!validate()) return

      dispatch(changePassword({ token, passwordInfo: credentials }))
      .then(() => {
          const errorUser = store.getState().user.error
          if (errorUser) {
              Swal.fire({
                  title: "Произошла ошибка!",
                  text: errorUser,
                  icon: 'error'
              })
              dispatch(userReducer.actions.errorSetDefault())
              return
          }
          Swal.fire({
            title: 'Пароль изменен!',
            icon: 'success',
            timer: 3000
          })
          setTimeout(navigate('/user/personalArea'), 3500)
      })
      
  }
  return (
    <BaseForm>
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