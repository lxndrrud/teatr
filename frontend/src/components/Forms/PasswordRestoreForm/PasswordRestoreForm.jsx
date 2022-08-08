import React from 'react'
import { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { errorSetDefault, restorePassword } from '../../../store/actions/userAction'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from '../../UI/CustomInput/CustomInput'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import BaseForm from '../BaseForm/BaseForm'

function PasswordRestoreForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const store = useStore()

    let [email, setEmail] = useState('')
    let [error, setError] = useState(null)
    function sendRestoreRequest(e) {
        e.preventDefault()

        dispatch(restorePassword(email))
        .then(() => {
            let errorStore = store.getState().user.error
            if (errorStore) setError(errorStore) 
        })
        .then(dispatch(errorSetDefault()))
        .then(() => { if (!error) navigate('/login')} )
    }
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
                type="submit"
                value="Подтвердить"
                onClickHook={sendRestoreRequest}
            />
        </BaseForm>
  )
}

export default PasswordRestoreForm