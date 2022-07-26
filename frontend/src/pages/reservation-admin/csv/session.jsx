//import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import FilePicker from "../../../components/UI/FilePicker/FilePicker";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import { checkLogin } from "../../../middlewares/authFunctions";
import { createSessionsCSV, clearSuccessErrorSession } from "../../../store/actions/sessionAction"

export default function SessionCSVUploadingPage() {
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
        dispatch(createSessionsCSV(token, selectedFile))
        .then(() => {
            const error = store.getState().session.error
            const success = store.getState().session.success
            if (error) {
                setErrorMessage(error)
            }
            else if (success) {
                setSuccessMessage(success)
            }
            dispatch(clearSuccessErrorSession())
        })
    }
    return (
        <AdminLayout title="Импорт сеансов">
            <FilePicker 
                onClickHook={onButtonClick} 
                onChangeHook={onChangeHook} 
                error={errorMessage}
                success={successMessage}
            />
        </AdminLayout>
    )
}