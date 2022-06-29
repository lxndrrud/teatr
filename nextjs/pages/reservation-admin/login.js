import React from 'react'
import AdminLayout from '../../layouts/AdminLayout/AdminLayout'
import LoginForm from '../../components/Forms/LoginForm/LoginForm'

const AdminLoginPage = () => {
    return (
        <AdminLayout title='Вход'>
            <LoginForm pushToDestination="/reservation-admin" />
        </AdminLayout>
    )
}

export default AdminLoginPage