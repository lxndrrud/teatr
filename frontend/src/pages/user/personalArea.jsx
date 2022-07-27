import React, { useEffect } from 'react'
import MainLayout from "../../layouts/MainLayout/MainLayout"
import { useDispatch, useSelector } from 'react-redux'
import { getPersonalArea } from '../../store/actions/userAction'
import { useNavigate } from 'react-router-dom'
import PersonalArea from '../../components/Users/PersonalArea'
import CustomLink from '../../components/UI/CustomLink/CustomLink'

function PersonalAreaPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let token = useSelector(state => state.user.token)

    useEffect(() => {
        dispatch(getPersonalArea(token))
    }, [dispatch, navigate, token])

    return (
        <MainLayout title={'Личный кабинет'}>
            <CustomLink destination={'/user/edit/personal'} 
                text="Редактировать личную информацию" />
            <CustomLink destination={'/user/edit/password'} 
                text="Изменить пароль" />
            <PersonalArea />
        </MainLayout>
    )
}

export default PersonalAreaPage