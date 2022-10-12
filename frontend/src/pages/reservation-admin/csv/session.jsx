import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import FilePicker from "../../../components/UI/FilePicker/FilePicker";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import { checkLogin } from "../../../middlewares/authFunctions";
import { createSessionsCSV } from "../../../store/actions/sessionAction"
import swal from 'sweetalert2'

export default function SessionCSVUploadingPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const navigate = useNavigate()

    let token = useSelector(state => state.user.token)

    let [selectedFile, setSelectedFile] = useState()

    useEffect(() => {
        if (!checkLogin(store)) {
            navigate('/reservation-admin/login')
            return
        }
    }, [navigate, store])
    const onChangeHook = (file) => {
        setSelectedFile(file)
    }
    const onButtonClick = (e) => {
        dispatch(createSessionsCSV({ token, file: selectedFile }))

        const error = store.getState().session.error
        if (!error) {
            swal.fire({
                title: 'Сеансы успешно загружены!',
                icon: 'success',
                timer: 2500
            })
        } else {
            //setErrorMessage(error)
            swal.fire({
                title: 'Произошла ошибка!',
                text: error,
                icon: 'error'
            })
            dispatch(clearSuccessErrorSession())
        }
    }
    return (
        <AdminLayout title="Импорт сеансов">
            <FilePicker 
                onClickHook={onButtonClick} 
                onChangeHook={onChangeHook} 
            />
        </AdminLayout>
    )
}