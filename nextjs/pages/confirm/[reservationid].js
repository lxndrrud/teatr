import MainLayout from "../../layouts/MainLayout/MainLayout";
import ReservationConfirmationForm 
    from "../../components/Forms/ReservationConfirmationForm/ReservationConfirmationForm";
import { useEffect } from "react";
import { useSelector, useStore, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { fetchReservation } from "../../store/actions/reservationAction";

const ConfirmationPage = () => {
    const store = useStore()
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (router.isReady) {
            const token = store.getState().user.token
            if(!(token && token.length > 0)) {
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