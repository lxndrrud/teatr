import React from 'react'
import AdminLayout from '../../layouts/AdminLayout/AdminLayout'
import LoginForm from '../../components/Forms/LoginForm/LoginForm'

function AdminLoginPage() {
    return (
        <AdminLayout title='Вход'>
            <LoginForm isAdmin />
        </AdminLayout>
    )
}

export default AdminLoginPage