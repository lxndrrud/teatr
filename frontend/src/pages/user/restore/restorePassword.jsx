import React from 'react'
import MainLayout from "../../../layouts/MainLayout/MainLayout"
import PasswordRestoreForm from '../../../components/Forms/PasswordRestoreForm/PasswordRestoreForm'

function RestorePasswordPage() {
    return (
        <MainLayout title={"Восстановление пароля"} >
            <PasswordRestoreForm />
        </MainLayout>
    )
}

export default RestorePasswordPage