import React, { useEffect } from 'react'
import MainLayout from "../../layouts/MainLayout/MainLayout"
import { useDispatch, useSelector, useStore } from 'react-redux'
import { getPersonalArea } from '../../store/actions/userAction'
import { useNavigate } from 'react-router-dom'
import PersonalArea from '../../components/Users/PersonalArea'
import CustomLink from '../../components/UI/CustomLink/CustomLink'
import Swal from 'sweetalert2'
import { userReducer } from '../../store/reducers/userReducer'

function PersonalAreaPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const store = useStore()
    let token = useSelector(state => state.user.token)

    useEffect(() => {
        dispatch(getPersonalArea({ token }))
        .then(() => {
            const errorUser = store.getState().user.error
            if (errorUser) {
                Swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorUser,
                    icon: "error"
                })
                dispatch(userReducer.actions.errorSetDefault())
                return
            } 
        })
    }, [dispatch, navigate, token])

    return (
        <MainLayout title={'Личный кабинет'}>
            <div className='ml-0 md:ml-4 w-[100%] flex flex-col sm:flex-row-reverse 
                items-center sm:items-start sm:justify-end'>
                <div className='md:ml-10 mt-[30px] mb-[15px] sm:mt-0 sm:mb-0 
                                w-[max-content] flex flex-col justify-start'>
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