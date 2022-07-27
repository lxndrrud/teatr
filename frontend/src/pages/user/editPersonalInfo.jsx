import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserEditPersonalInfoForm from '../../components/Forms/UserEditPersonalInfoForm/UserEditPersonalInfoForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { getPersonalArea } from '../../store/actions/userAction'

function EditUserInfoPage() {
    const dispatch = useDispatch()

    let token = useSelector(state => state.user.token)

    useEffect(() => {
        dispatch(getPersonalArea(token))
    }, [dispatch])
    return (
        <MainLayout title='Редактирование личной информации'>
            <UserEditPersonalInfoForm />
        </MainLayout>
    )
}

export default EditUserInfoPage