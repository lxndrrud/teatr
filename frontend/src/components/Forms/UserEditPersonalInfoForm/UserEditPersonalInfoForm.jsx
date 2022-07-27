import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styles from "./UserEditPersonalInfoForm.module.css"
import BaseForm from '../BaseForm/BaseForm'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from "../../UI/CustomInput/CustomInput"


function UserEditPersonalInfoForm() {
    let [user, setUser] = useState(useSelector(state => state.user.user))

    return (
        <BaseForm>
            <CustomInput value={user.firstname} 
                onChange={(e) => {setUser({...user, firstname: e.target.value })}} />
            <CustomInput value={user.middlename}
                onChange={(e) => {setUser({...user, middlename: e.target.value })}} />
            <CustomInput value={user.lastname} 
                onChange={(e) => {setUser({...user, lastname: e.target.value })}} />
            <CustomButton type="submit"
                value="Сохранить" onClickHook={(e) => {
                    e.preventDefault()
                    console.log(user)
                }} />
        </BaseForm>
    )
}

export default UserEditPersonalInfoForm