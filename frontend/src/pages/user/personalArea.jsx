import React, { useEffect } from 'react'
import MainLayout from "../../layouts/MainLayout/MainLayout"
import { useDispatch, useSelector, useStore } from 'react-redux'
import { getPersonalArea } from '../../store/actions/userAction'
import { checkLogin } from '../../middlewares/authFunctions'
import { useNavigate } from 'react-router-dom'
//import { useRouter } from "next/router"
import PersonalArea from '../../components/Users/PersonalArea'

function PersonalAreaPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const navigate = useNavigate()
    let token = useSelector(state => state.user.token)

    useEffect(() => {
        /*
        if (!checkLogin(store)) {
            navigate('/login')
        }
        */
        dispatch(getPersonalArea(token))
    }, [dispatch, navigate, token])

    let user = useSelector(state => state.user.user)

    return (
        <MainLayout title={'Личный кабинет'}>
            <PersonalArea user={user} />
        </MainLayout>
    )
}

export default PersonalAreaPage