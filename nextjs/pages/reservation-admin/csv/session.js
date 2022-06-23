import { useState } from "react";
import { useDispatch } from "react-redux";
import FilePicker from "../components/UI/FilePicker/FilePicker";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import { createSessionsCSV } from "../store/actions/sessionAction"

export default function SessionCSVUploadingPage() {
    const dispatch = useDispatch()
    let [selectedFile, setSelectedFile] = useState()
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