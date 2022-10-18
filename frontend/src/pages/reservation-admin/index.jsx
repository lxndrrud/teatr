import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useStore } from 'react-redux'
import AdminLayout from "../../layouts/AdminLayout/AdminLayout"
import { checkLogin } from '../../middlewares/authFunctions'

function AdminIndex() {
    const store = useStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (!checkLogin(store)) {
            navigate('/reservation-admin/login')
            return
        }
    }, [navigate, store])
    return (
        <AdminLayout title={"Главная страница администрирования"} >
        </AdminLayout>
    )
}

export default AdminIndex