import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import FilePicker from "../../../components/UI/FilePicker/FilePicker";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import { checkLogin } from "../../../middlewares/authFunctions";
import { createPlaysCSV } from "../../../store/actions/playAction"
import Swal from 'sweetalert2'
import { playReducer } from "../../../store/reducers/playReducer";

export default function PlayCSVUploadingPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const navigate = useNavigate()

    let { token } = useSelector(state => state.user)
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
        dispatch(createPlaysCSV({ token, file: selectedFile }))
        .then(() => {
            const errorPlay = store.getState().play.error
            if (errorPlay) {
                Swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorPlay,
                    icon: "error"
                })
                dispatch(playReducer.actions.clearError())
                return
            }
            Swal.fire({
                title: 'Спектакли успешно загружены!',
                icon: 'success',
                timer: 5000
            })
        })
    }
    
    return (
        <AdminLayout title="Импорт спектаклей">
            <FilePicker 
                onClickHook={onButtonClick} 
                onChangeHook={onChangeHook} 
            />
        </AdminLayout>
    )
}