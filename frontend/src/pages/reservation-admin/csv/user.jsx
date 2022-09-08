import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../../../middlewares/authFunctions";
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout'
import FilePicker from '../../../components/UI/FilePicker/FilePicker'
import { createUsersCSV, errorSetDefault, successSetDefault } from "../../../store/actions/userAction";

function UserCSVUploadingPage() {
    const dispatch = useDispatch()
    const store = useStore()
    //const router = useRouter()
    const navigate = useNavigate()
    let token = useSelector(state => state.user.token)
    let [errorMessage, setErrorMessage] = useState()
    let [successMessage, setSuccessMessage] = useState()
    let [selectedFile, setSelectedFile] = useState()

    useEffect(() => {
        //if (router.isReady) {
        if (!checkLogin(store)) {
            navigate('/reservation-admin/login')
            return
        }
        //}
    }, [navigate, store])
    const onChangeHook = (file) => {
        setSelectedFile(file)
    }
    const onButtonClick = (e) => {
        dispatch(createUsersCSV(token, selectedFile))
        .then(() => {
            const error = store.getState().users.error
            if (error) {
                setErrorMessage(error)
            } else if (success) {
                setSuccessMessage(success)
            }
            dispatch(errorSetDefault())
            dispatch(successSetDefault())
        })
    }


    return (
        <AdminLayout title="Импорт пользователей">
            <FilePicker 
                onClickHook={onButtonClick} 
                onChangeHook={onChangeHook} 
                error={errorMessage}
                success={successMessage}
            />
        </AdminLayout>
    )
}

export default UserCSVUploadingPage