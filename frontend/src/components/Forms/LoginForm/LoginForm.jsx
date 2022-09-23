import React, { useEffect, useState } from 'react'
import BaseForm from '../BaseForm/BaseForm'
import CustomInput from "../../UI/CustomInput/CustomInput"
import CustomButton from "../../UI/CustomButton/CustomButton"
import CustomLink from "../../UI/CustomLink/CustomLink"
import { useDispatch, useStore } from 'react-redux'
//import { useRouter } from 'next/router'
import { useNavigate } from 'react-router-dom'
import { errorSetDefault, logIn, logInAdmin } from "../../../store/actions/userAction"
import styles from "./LoginForm.module.css"
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import { checkLogin } from '../../../middlewares/authFunctions'
import masksPicture from '../../../assets/maski.png'

function LoginForm({ isAdmin=false }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const store = useStore()

    let [error, setError] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    useEffect(() => {
        if (checkLogin(store)) {
            if (!isAdmin)
                navigate("/")
            else 
               navigate("/reservation-admin")
        }
    }, [navigate, store])

    const sendPostRequest = (e) => {
        e.preventDefault()
        if (!isAdmin) {
            dispatch(logIn(email, password))
            .then(() => {
                const errorFromStore = store.getState().user.error 
                if (errorFromStore !== null) {
                    setError(errorFromStore)
                    dispatch(errorSetDefault())
                } else {
                    navigate('/')
                }
            })
        } else {
            dispatch(logInAdmin(email, password))
            .then(() => {
                const errorFromStore = store.getState().user.error 
                if (errorFromStore !== null) {
                    setError(errorFromStore)
                    dispatch(errorSetDefault())
                } else {
                    navigate("/reservation-admin")
                }
            })
        }
    }
    return (
        <BaseForm styleClass={styles.loginForm}>
            <div className='flex justify-center items-center'>
                <img src={masksPicture} alt=""  className='w-[300px]'/>
            </div>
            <div className='mt-5 mb-3 '>
                
                <CustomInput type="email" name="email" value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    description="Почта" 
                    required />
            </div>
            <div className='mb-3'>
                <CustomInput type="password" name="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    description="Пароль" 
                    required />
            </div>
            

            

            {
                error !== ''
                ? <ErrorMessage text={error} />
                : null
            }
            <CustomLink
                destination="/user/restore/password"
                text="Восстановить пароль"
            />

            <CustomButton type="submit" value="Подтвердить" 
                onClickHook={sendPostRequest}
                styleClass={styles.fullWidthButton} />
        </BaseForm>
    )
}

export default LoginForm