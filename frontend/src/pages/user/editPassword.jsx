import React from 'react'
import UserEditPasswordForm from '../../components/Forms/UserEditPasswordForm/UserEditPasswordForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'

function EditUserPasswordPage() {
  return (
    <MainLayout title="Изменение пароля">
        <UserEditPasswordForm />
    </MainLayout>
  )
}

export default EditUserPasswordPage