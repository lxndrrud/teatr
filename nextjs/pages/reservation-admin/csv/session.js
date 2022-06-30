import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import FilePicker from "../../../components/UI/FilePicker/FilePicker";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import { checkLogin } from "../../../middlewares/auth";
import { createSessionsCSV, clearSuccessErrorSession } from "../../../store/actions/sessionAction"

export default function SessionCSVUploadingPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const router = useRouter()
    let [errorMessage, setErrorMessage] = useState()
    let [successMessage, setSuccessMessage] = useState()

    let [selectedFile, setSelectedFile] = useState()

    useEffect(() => {
        if (router.isReady) {
            if (!checkLogin(store)) {
                router.push('/reservation-admin/login')
                return
            }
        }
    })
    const onChangeHook = (file) => {
        setSelectedFile(file)
    }
    const onButtonClick = (e) => {
        dispatch(createSessionsCSV(selectedFile))
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