import React, { useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import Swal from 'sweetalert2'
import UserEditPersonalInfoForm from '../../components/Forms/UserEditPersonalInfoForm/UserEditPersonalInfoForm'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { getPersonalArea } from '../../store/actions/userAction'
import { userReducer } from '../../store/reducers/userReducer'

function EditUserInfoPage() {
    const dispatch = useDispatch()
    const store = useStore()

    let token = useSelector(state => state.user.token)

    useEffect(() => {
        dispatch(getPersonalArea({ token }))
        .then(() =>  {
            const errorUser = store.getState().user.error
            if (errorUser) {
                Swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorUser,
                    icon: 'error'
                })
                dispatch(userReducer.actions.errorSetDefault())
                return
            }
        })
    }, [dispatch])
    return (
        <MainLayout title='Редактирование личной информации'>
            <UserEditPersonalInfoForm />
        </MainLayout>
    )
}

export default EditUserInfoPage