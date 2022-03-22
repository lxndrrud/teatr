import MainLayout from "../../layouts/MainLayout/MainLayout"
import ReservationList from "../../components/Reservations/ReservationList/ReservationList"
import { useDispatch, useSelector, useStore } from "react-redux"
import { fetchUserReservations } from "../../store/actions/reservationAction"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function ControlIndex() {
    const dispatch = useDispatch()
    const store = useStore()
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            const token = store.getState().user.token
            if(!(token && token.length > 0)) {
                router.push('/login')
                return
            }
            dispatch(fetchUserReservations(token))
        }
    })

    return (
        <>
            <MainLayout title="Управление бронями">
                <ReservationList />
            </MainLayout>
        </>
    )
}