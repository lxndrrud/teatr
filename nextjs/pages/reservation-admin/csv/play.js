import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import FilePicker from "../../../components/UI/FilePicker/FilePicker";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import { checkLogin } from "../../../middlewares/auth";
import { createPlaysCSV, clearSuccessErrorPlay } from "../../../store/actions/playAction"

export default function SessionCSVUploadingPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const router = useRouter()
    let token = useSelector(state => state.user.token)
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
    }, [router, store])
    const onChangeHook = (file) => {
        setSelectedFile(file)
    }
    const onButtonClick = (e) => {
        dispatch(createPlaysCSV(token, selectedFile))
        .then(() => {
            const error = store.getState().play.error
            const success = store.getState().play.success
            if (error) {
                setErrorMessage(error)
            }
            else if (success) {
                setSuccessMessage(success)
            }
            dispatch(clearSuccessErrorPlay())
        })
    }
    
    return (
        <AdminLayout title="Импорт спектаклей">
            <FilePicker 
                onClickHook={onButtonClick} 
                onChangeHook={onChangeHook} 
                error={errorMessage}
                success={successMessage}
            />
        </AdminLayout>
    )
}