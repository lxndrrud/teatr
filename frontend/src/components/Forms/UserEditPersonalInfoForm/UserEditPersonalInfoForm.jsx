import React, { useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import BaseForm from '../BaseForm/BaseForm'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from "../../UI/CustomInput/CustomInput"
import { useNavigate } from 'react-router-dom'
import { changePersonalInfo } from '../../../store/actions/userAction'
import { userReducer } from '../../../store/reducers/userReducer'
import Swal from 'sweetalert2'


function UserEditPersonalInfoForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()
    let { token } = useSelector(state => state.user)

    let [firstname, setFirstname] = useState(useSelector(state => state.user.user.firstname))
    let [middlename, setMiddlename] = useState(useSelector(state => state.user.user.middlename))
    let [lastname, setLastname] = useState(useSelector(state => state.user.user.lastname))

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

    async function sendChangePersonalRequest(e) {
        e.preventDefault()

        const user = validate()
        
        dispatch(changePersonalInfo({ token, personalInfo: user }))
        .then(() => {
            const errorUser = store.getState().user.error
            if (errorUser) {
                Swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorUser,
                    icon: 'error'
                })
                dispatch(userReducer.actions.errorSetDefault())
                return
            }
            Swal.fire({
                title: 'Информация успешно изменена!',
                icon: 'success',
                timer: 3000
            })
            setTimeout(navigate('/user/personalArea'), 3500)
        })
    }

    return (
        <BaseForm>
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