import React, { useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import BaseForm from '../BaseForm/BaseForm'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from "../../UI/CustomInput/CustomInput"
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import { useNavigate } from 'react-router-dom'
import { changePersonalInfo } from '../../../store/actions/userAction'
import { userReducer } from '../../../store/reducers/userReducer'
import swal from 'sweetalert2'


function UserEditPersonalInfoForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()
    let { token } = useSelector(state => state.user)

    let [firstname, setFirstname] = useState(useSelector(state => state.user.user.firstname))
    let [middlename, setMiddlename] = useState(useSelector(state => state.user.user.middlename))
    let [lastname, setLastname] = useState(useSelector(state => state.user.user.lastname))

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

        const user = validate()
        
        dispatch(changePersonalInfo({token, personalInfo: user}))
        const errorStore = store.getState().user.error
        if (!errorStore) {
            swal.fire({
                title: 'Информация успешно изменена!',
                icon: 'success',
                timer: 2000
            })
            setTimeout(() => navigate('/user/personalArea'), 2500)
        } else {
            setError(errorStore)
            dispatch(userReducer.actions.errorSetDefault())
        }
        
    }

    return (
        <BaseForm>
            {
                error && <ErrorMessage text={error} />
            }
            <CustomInput
                description={'Фамилия'} 
                value={lastname} 
                onChange={(e) => {
                    setLastname(e.target.value)
                }} />
            <CustomInput 
                description={'Имя'}
                value={firstname} 
                onChange={(e) => {
                   setFirstname(e.target.value)
                }} />
            <CustomInput 
                description={'Отчество'}
                value={middlename}
                onChange={(e) => {
                    setMiddlename(e.target.value)
                }} />
            <CustomButton 
                type="submit"
                value="Сохранить" 
                onClickHook={sendChangePersonalRequest} />
        </BaseForm>
    )
}

export default UserEditPersonalInfoForm