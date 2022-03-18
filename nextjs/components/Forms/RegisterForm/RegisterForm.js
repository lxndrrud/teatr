import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import BaseForm from '../BaseForm/BaseForm'
import CustomInput from '../../UI/CustomInput/CustomInput'
import CustomButton from '../../UI/CustomButton/CustomButton'
import { register } from '../../../store/actions/userAction'
import styles from "./RegisterForm.module.css"

const RegisterForm = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const token = useSelector(state => state.user.token)
    
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [firstname, setFirstname] = useState(undefined)
    let [middlename, setMiddlename] = useState(undefined)
    let [lastname, setLastname] = useState(undefined)

    useEffect(() => {
        if (token && token.length !== 0) {
            router.push('/')
        }
    })

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
    }
    return (
        <BaseForm styleClass={styles.registerForm}>
            <div className={styles.itemsContainer}>
                <CustomInput type="email" name="email" value={email} 
                    onChange={syncEmail} 
                    description="Почта" 
                    required />

                <CustomInput type="password" name="password" value={password} 
                    onChange={syncPassword} 
                    description="Пароль" 
                    required />

                <CustomInput type="text" name="firstname" value={firstname} 
                    onChange={syncFirstname} 
                    description="Имя (необязательно)"
                    inputStyleClass={styles.notRequiredInputBorderColor} />

                <CustomInput type="text" name="middlename" value={middlename} 
                    onChange={syncMiddlename} 
                    description="Отчество (необязательно)"
                    inputStyleClass={styles.notRequiredInputBorderColor}  />

                <CustomInput type="text" name="lastname" value={lastname} 
                    onChange={syncLastname} 
                    description="Фамилия (необязательно)" 
                    inputStyleClass={styles.notRequiredInputBorderColor}  />

                <CustomButton type="submit" value="Подтвердить" 
                    onClickHook={sendPostRequest}
                    styleClass={styles.fullWidthButton} />
            </div>
        </BaseForm>
    )
}

export default RegisterForm