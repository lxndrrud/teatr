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
            <div className='ml-0 md:ml-4 w-[100%] flex flex-col sm:flex-row-reverse justify-end'>
                <div className='md:ml-10 w-[max-content] flex flex-col justify-start items-space'>
                    <CustomLink destination={'/user/edit/personal'} 
                        text="Изменить данные" />
                    <CustomLink destination={'/user/edit/password'} 
                        text="Изменить пароль" />
                </div>
                <PersonalArea />
            </div>
            
        </MainLayout>
    )
}

export default PersonalAreaPage