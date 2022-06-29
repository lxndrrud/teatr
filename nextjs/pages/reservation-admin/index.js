import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useStore } from 'react-redux'
import AdminLayout from "../../layouts/AdminLayout/AdminLayout"
import { checkLogin } from '../../middlewares/auth'

const AdminIndex = () => {
    const store = useStore()
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            if (!checkLogin(store)) {
                router.push('/reservation-admin/login')
                return
            }
        }
    })
    return (
        <AdminLayout title={"Главная страница администрирования"} >
            <h3>o_0</h3>
        </AdminLayout>
    )
}

export default AdminIndex