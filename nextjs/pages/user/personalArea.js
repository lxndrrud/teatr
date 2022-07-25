import React, { useEffect } from 'react'
import MainLayout from "../../layouts/MainLayout/MainLayout"
import { useDispatch, useSelector, useStore } from 'react-redux'
import { getPersonalArea } from '../../store/actions/userAction'
import { checkLogin } from '../../middlewares/auth'
import { useRouter } from "next/router"
import PersonalArea from '../../components/Users/PersonalAreaItem/PersonalArea'

function PersonalAreaPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const router = useRouter()
    let token = useSelector(state => state.user.token)

    useEffect(() => {
        if (!checkLogin(store)) {
            router.push('/login')
        }
        dispatch(getPersonalArea(token))
    }, [dispatch, router, token])

    let user = useSelector(state => state.user.user)

    return (
        <MainLayout title={'Личный кабинет'}>
            <PersonalArea user={user} />
        </MainLayout>
    )
}

export default PersonalAreaPage