import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
//import { useRouter } from 'next/router'
import { useNavigate } from 'react-router-dom'
import BaseForm from '../BaseForm/BaseForm'
import CustomInput from '../../UI/CustomInput/CustomInput'
import CustomButton from '../../UI/CustomButton/CustomButton'
import { errorSetDefault, register } from '../../../store/actions/userAction'
import styles from "./RegisterForm.module.css"
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import { checkLogin } from '../../../middlewares/authFunctions'

function RegisterForm() {
    const dispatch = useDispatch()
    //const router = useRouter()
    const navigate = useNavigate()
    const store = useStore()
    
    let [error, setError] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [firstname, setFirstname] = useState(undefined)
    let [middlename, setMiddlename] = useState(undefined)
    let [lastname, setLastname] = useState(undefined)

    useEffect(() => {
        if (checkLogin(store)) {
            navigate('/')
        }
    }, [navigate, store])

    const syncEmail = (e) => {
        setEmail(e.target.value)
    }
    const syncPassword = (e) => {
        setPassword(e.target.value)
    }
    const syncFirstname = (e) => {
        setFirstname(e.target.value)
    }
    const syncMiddlename = (e) => {
        setMiddlename(e.target.value)
    }
    const syncLastname = (e) => {
        setLastname(e.target.value)
    }
    const sendPostRequest = (e) => {
        e.preventDefault()

        if (email && password)
            dispatch(register(email, password, firstname, middlename, lastname))
            .then(() => {
                const errorFromStore = store.getState().user.error
                if (errorFromStore !== null) {
                    setError(errorFromStore)
                    dispatch(errorSetDefault())
                }
            })
    }
    return (
        <BaseForm styleClass={styles.registerForm}>
            <div>
                <CustomInput type="email" name="email" value={email} 
                    onChange={syncEmail} 
                    description="Почта" 
                    required />
            </div>
            <div className='mt-3'>
                <CustomInput type="password" name="password" value={password} 
                    onChange={syncPassword} 
                    description="Пароль" 
                    required />
            </div>
            <div className='mt-3'>
                <CustomInput type="text" name="firstname" value={firstname} 
                    onChange={syncFirstname} 
                    description="Имя (необязательно)"
                    inputStyleClass={styles.notRequiredInputBorderColor} />
            </div>
            <div className='mt-3'>
                <CustomInput type="text" name="middlename" value={middlename} 
                    onChange={syncMiddlename} 
                    description="Отчество (необязательно)"
                    inputStyleClass={styles.notRequiredInputBorderColor}  />
            </div>
            <div className='mt-3 mb-3'>
                <CustomInput type="text" name="lastname" value={lastname} 
                    onChange={syncLastname} 
                    description="Фамилия (необязательно)" 
                    inputStyleClass={styles.notRequiredInputBorderColor}  />
            </div>
            {
                error !== '' 
                ? <ErrorMessage text={error} />
                : null
            }
            <div className='mb-3'></div>
            <CustomButton type="submit" value="Подтвердить" 
                onClickHook={sendPostRequest}
                styleClass={styles.fullWidthButton} />
        </BaseForm>
    )
}

export default RegisterForm