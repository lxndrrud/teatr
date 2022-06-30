import React, { useEffect, useState } from 'react'
import BaseForm from '../BaseForm/BaseForm'
import CustomInput from "../../UI/CustomInput/CustomInput"
import CustomButton from "../../UI/CustomButton/CustomButton"
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useRouter } from 'next/router'
import { errorSetDefault, logIn, logInAdmin } from "../../../store/actions/userAction"
import styles from "./LoginForm.module.css"
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'

function LoginForm({ isAdmin=false }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const store = useStore()
    let token = useSelector(state => state.user.token)

    let [error, setError] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    useEffect(() => {
        if (token && token.length !== 0) {
            if (!isAdmin)
                router.push("/")
            else 
                router.push("/reservation-admin")
        }
    })

    const sendPostRequest = (e) => {
        e.preventDefault()
        if (!isAdmin) {
            dispatch(logIn(email, password))
            .then(() => {
                const errorFromStore = store.getState().user.error 
                if (errorFromStore !== null) {
                    setError(errorFromStore)
                    dispatch(errorSetDefault())
                }
            })
        } else {
            dispatch(logInAdmin(email, password))
            .then(() => {
                const errorFromStore = store.getState().user.error 
                if (errorFromStore !== null) {
                    setError(errorFromStore)
                    dispatch(errorSetDefault())
                }
            })
        }
    }
    return (
        <BaseForm styleClass={styles.loginForm}>
            <CustomInput type="email" name="email" value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                description="Почта" 
                required />

            <CustomInput type="password" name="password" value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                description="Пароль" 
                required />

            {
                error !== ''
                ? <ErrorMessage text={error} />
                : null
            }

            <CustomButton type="submit" value="Подтвердить" 
                onClickHook={sendPostRequest}
                styleClass={styles.fullWidthButton} />
        </BaseForm>
    )
}

export default LoginForm