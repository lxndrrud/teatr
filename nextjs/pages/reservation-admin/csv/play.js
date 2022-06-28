import { useState } from "react";
import { useDispatch } from "react-redux";
import FilePicker from "../../../components/UI/FilePicker/FilePicker";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import { createPlaysCSV } from "../../../store/actions/playAction"

export default function SessionCSVUploadingPage() {
    const dispatch = useDispatch()
    let [selectedFile, setSelectedFile] = useState()
    const onChangeHook = (file) => {
        setSelectedFile(file)
    }
    const onButtonClick = (e) => {
        dispatch(createPlaysCSV(selectedFile))
    }
    return (
        <AdminLayout title="Импорт спектаклей">
            <FilePicker onClickHook={onButtonClick} onChangeHook={onChangeHook} />
        </AdminLayout>
    )
}