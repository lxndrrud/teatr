import { useState } from "react";
import { useDispatch } from "react-redux";
import FilePicker from "../components/UI/FilePicker/FilePicker";
import MainLayout from "../layouts/MainLayout/MainLayout";
import {createSessionsCSV} from "../store/actions/sessionAction"

export default function TestPage() {
    const dispatch = useDispatch()
    let [selectedFile, setSelectedFile] = useState()
    const onChangeHook = (file) => {
        setSelectedFile(file)
    }
    const onButtonClick = (e) => {
        dispatch(createSessionsCSV(selectedFile))
    }
    return (
        <MainLayout title="Тестовая страница">
            <FilePicker onClickHook={onButtonClick} onChangeHook={onChangeHook} />
        </MainLayout>
    )
}