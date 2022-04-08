import MainLayout from "../../layouts/MainLayout/MainLayout";
import ReservationConfirmationForm 
    from "../../components/Forms/ReservationConfirmationForm/ReservationConfirmationForm";
import { useEffect } from "react";
import { useSelector, useStore, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { fetchReservation } from "../../store/actions/reservationAction";
import { checkLogin } from "../../middlewares/auth";

const ConfirmationPage = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        const token = store.getState().user.token
        if (router.isReady) {
            if (!checkLogin(store)) {
                router.push('/login')
                return
            }
            // Задиспатчить получение брони 
            dispatch(fetchReservation({ token, id_reservation: router.query.reservationid }))
        }
    })

    return (
        <MainLayout title='Подтверждение брони'>
            <ReservationConfirmationForm />
        </MainLayout>
    )
}

export default ConfirmationPage