import MainLayout from "../../layouts/MainLayout/MainLayout";
import ReservationConfirmationForm 
    from "../../components/Forms/ReservationConfirmationForm/ReservationConfirmationForm";
import { useEffect } from "react";
import { useSelector, useStore, useDispatch } from "react-redux";
import { fetchReservation } from "../../store/actions/reservationAction";
import { checkLogin } from "../../middlewares/authFunctions";
import { useNavigate, useParams } from "react-router-dom";
import swal from 'sweetalert2'

function ConfirmationPage() {
    const store = useStore()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { idReservation }  = useParams()
    let { token } = useSelector(state => state.user)

    useEffect(() => {
        if (!checkLogin(store)) {
            navigate('/login')
            return
        }
        // Задиспатчить получение брони 
        dispatch(fetchReservation({ token, idReservation }))
        .then(() => {
            const errorReservation = store.getState().reservation.error
            if (errorReservation) {
                swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorReservation,
                    icon: "error"
                })
                return
            }
        })
        
    }, [token, store])

    return (
        <MainLayout title='Подтверждение брони'>
            <ReservationConfirmationForm />
        </MainLayout>
    )
}

export default ConfirmationPage