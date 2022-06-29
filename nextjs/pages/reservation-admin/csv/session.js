import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import FilePicker from "../../../components/UI/FilePicker/FilePicker";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import { checkLogin } from "../../../middlewares/auth";
import { createSessionsCSV } from "../../../store/actions/sessionAction"

export default function SessionCSVUploadingPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const router = useRouter()

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
    }
    return (
        <AdminLayout title="Импорт сеансов">
            <FilePicker onClickHook={onButtonClick} onChangeHook={onChangeHook} />
        </AdminLayout>
    )
}