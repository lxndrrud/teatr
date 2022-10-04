import MainLayout from "../../layouts/MainLayout/MainLayout";
import ReservationConfirmationForm 
    from "../../components/Forms/ReservationConfirmationForm/ReservationConfirmationForm";
import { useEffect } from "react";
import { useSelector, useStore, useDispatch } from "react-redux";
//import { useRouter } from "next/router";
import { fetchReservation } from "../../store/actions/reservationAction";
import { checkLogin } from "../../middlewares/authFunctions";
import { useNavigate, useParams } from "react-router-dom";

function ConfirmationPage() {
    const store = useStore()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    //const router = useRouter()

    const { idReservation }  = useParams()
    let { token } = useSelector(state => state.user)

    useEffect(() => {
        //const token = store.getState().user.token
        //if (router.isReady) {
            if (!checkLogin(store)) {
                navigate('/login')
                return
            }
            // Задиспатчить получение брони 
            dispatch(fetchReservation({ token, id_reservation: idReservation }))
        //}
    }, [token, store])

    return (
        <MainLayout title='Подтверждение брони'>
            <ReservationConfirmationForm />
        </MainLayout>
    )
}

export default ConfirmationPage