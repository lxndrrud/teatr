import React from 'react'
//import axios from 'axios'
import { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom'
//import { useMutation } from 'react-query'
import { errorSetDefault, resendRestoreEmail, restorePassword } from '../../../store/actions/userAction'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from '../../UI/CustomInput/CustomInput'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import BaseForm from '../BaseForm/BaseForm'

function PasswordRestoreForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const store = useStore()
    /*
    const resendMutation = useMutation(email => {
        return axios.post('/expressjs/users/restore/password/resendEmail', { email })
    }, {
        onSuccess: () => alert('Сообщение отправлено!'),
        onError: () => alert('Ошибка!')
    })*/

    let [sentEmail, setSentEmail] = useState(false)
    let [email, setEmail] = useState('')
    let [error, setError] = useState(null)
    function sendRestoreRequest(e) {
        e.preventDefault()
        if (!email) {
            setError('Вы не указали почту!')
        } else {
            dispatch(restorePassword(email))
            .then(() => {
                let errorStore = store.getState().user.error
                if (errorStore) {
                    setError(errorStore)
                    dispatch(errorSetDefault()) 
                } else {
                    setSentEmail(true)
                }
            })
        }
    }
    async function resendPasswordOnEmail(e) {
        e.preventDefault()
        //resendMutation.mutate(email)
        const response = await dispatch(resendRestoreEmail({ email }))
        if (response.error) setError(response.error.message)
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
                value='Отправить на почту заново'
                onClickHook={resendPasswordOnEmail}
                disabled={!sentEmail}
            />
            <CustomButton 
                value="Подтвердить"
                onClickHook={sendRestoreRequest}
            />
        </BaseForm>
  )
}

export default PasswordRestoreForm