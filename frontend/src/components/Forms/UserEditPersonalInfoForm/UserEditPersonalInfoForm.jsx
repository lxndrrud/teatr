import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import styles from "./UserEditPersonalInfoForm.module.css"
import BaseForm from '../BaseForm/BaseForm'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from "../../UI/CustomInput/CustomInput"
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import SuccessMessage from '../../UI/SuccessMessage/SuccessMessage'
import { useNavigate } from 'react-router-dom'
import { changePersonalInfo, errorSetDefault, successSetDefault } from '../../../store/actions/userAction'


function UserEditPersonalInfoForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()
    let token = useSelector(state => state.user.token)

    //let [user, setUser] = useState(useSelector(state => state.user.user))
    let [firstname, setFirstname] = useState(useSelector(state => state.user.user.firstname))
    let [middlename, setMiddlename] = useState(useSelector(state => state.user.user.middlename))
    let [lastname, setLastname] = useState(useSelector(state => state.user.user.lastname))

    let [success, setSuccess] = useState(null)
    let [error, setError] = useState(null)

    function validate() {
        let user = {
            firstname, middlename, lastname
        } 
        if (!user.firstname) {
            user.firstname = "Не указано"
        }
        if (!user.middlename) {
            user.middlename = "Не указано"
        }
        if (!user.lastname) {
            user.lastname = "Не указано"
        }
        return user
    }

    function sendChangePersonalRequest(e) {
        e.preventDefault()

        setError(null)
        setSuccess(null)  

        const user = validate()
        
        dispatch(changePersonalInfo(token, user))
        .then(() => {
            let successStore = store.getState().user.success,
                errorStore = store.getState().user.error
            if (!successStore && errorStore) setError(errorStore) 
            else if (!errorStore && successStore) setSuccess(successStore)
        })
        .then(dispatch(successSetDefault()))
        .then(dispatch(errorSetDefault()))
        .then(() => {
            if (!error) navigate('/user/personalArea')
        })
    }

    return (
        <BaseForm>
            {
                error && <ErrorMessage text={error} />
            }
            {
                success && <SuccessMessage text={success} />
            }
            <CustomInput value={firstname} 
                onChange={(e) => {
                   setFirstname(e.target.value)
                }} />
            <CustomInput value={middlename}
                onChange={(e) => {
                    setMiddlename(e.target.value)
                }} />
            <CustomInput value={lastname} 
                onChange={(e) => {
                    setLastname(e.target.value)
                }} />
            <CustomButton type="submit"
                value="Сохранить" onClickHook={sendChangePersonalRequest} />
        </BaseForm>
    )
}

export default UserEditPersonalInfoForm