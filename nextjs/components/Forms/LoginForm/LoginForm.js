import React, { useEffect, useState } from 'react'
import BaseForm from '../BaseForm/BaseForm'
import CustomInput from "../../CustomInput/CustomInput"
import CustomButton from "../../CustomButton/CustomButton"
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { logIn } from "../../../store/actions/userAction"
import styles from "./LoginForm.module.css"

const LoginForm = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const token = useSelector(state => state.user.token)
    
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

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
    const sendPostRequest = (e) => {
        e.preventDefault()
        
        if (email && password) { 
            console.log(email, password)  
            dispatch(logIn(email, password))
        }
    }
    return (
        <BaseForm>
            <CustomInput type="email" name="email" value={email} 
                onChange={syncEmail} 
                description="Почта" 
                required />

            <CustomInput type="password" name="password" value={password} 
                onChange={syncPassword} 
                description="Пароль" 
                required />

            <CustomButton type="submit" value="Подтвердить" 
                onClickHook={sendPostRequest} />

        </BaseForm>
    )
}

export default LoginForm