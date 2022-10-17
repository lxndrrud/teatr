import React from 'react'
import { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { resendRestoreEmail, restorePassword } from '../../../store/actions/userAction'
import { userReducer } from '../../../store/reducers/userReducer'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from '../../UI/CustomInput/CustomInput'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import BaseForm from '../BaseForm/BaseForm'
import Swal from 'sweetalert2'

function PasswordRestoreForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const store = useStore()
    let [email, setEmail] = useState('')
    let [error, setError] = useState(null)
    async function sendRestoreRequest(e) {
        e.preventDefault()
        if (!email) {
            setError('Вы не указали почту!')
            return
        }
        
        dispatch(restorePassword({ email }))
        .then(() => {
            let errorUser = store.getState().user.error
            if (errorUser) {
                Swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorUser,
                    icon: "error"
                })
                setError(errorUser)
                dispatch(userReducer.actions.errorSetDefault())
                return 
            }
            navigate('/login')
            Swal.fire({
                title: 'Сообщение на почту отправлено',
                text: 'Следующее восстановление будет доступно через 15 минут.',
                icon: 'success',
                timer: 5000
            })
        })
        
    }
    async function resendPasswordOnEmail(e) {
        e.preventDefault()
        //resendMutation.mutate(email)
        dispatch(resendRestoreEmail({ email }))
        .then(() => {   
            let errorStore = store.getState().user.error 
            if (errorStore) setError(errorStore)
        })
        
    }
    /**
     * 
     * <CustomButton
                value='Отправить на почту заново'
                onClickHook={resendPasswordOnEmail}
                disabled={!sentEmail}
            />
     */
    return (
        <BaseForm>
            <CustomInput 
                onChange={(e) => setEmail(e.target.value) }
                description='Введите почту'
            />
            {
                error && <ErrorMessage text={error} />
            }
            
            <CustomButton 
                value="Подтвердить"
                onClickHook={sendRestoreRequest}
            />
        </BaseForm>
  )
}

export default PasswordRestoreForm