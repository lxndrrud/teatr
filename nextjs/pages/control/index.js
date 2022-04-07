import MainLayout from "../../layouts/MainLayout/MainLayout"
import ReservationFilter from "../../components/Filters/ReservationFilter/ReservationFilter"
import ReservationList from "../../components/Reservations/ReservationList/ReservationList"
import { useDispatch, useSelector, useStore } from "react-redux"
import { fetchReservations } from "../../store/actions/reservationAction"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { checkLogin } from "../../middlewares/auth"

export default function ControlIndex() {
    const dispatch = useDispatch()
    const store = useStore()
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            const token = store.getState().user.token
            if(!checkLogin(store)) {
                if (router.isReady) { 
                    router.push('/login')
                    return
                }
            }
            dispatch(fetchReservations(token))
        }
    })

    return (
        <>
            <MainLayout title="Управление бронями">
                <ReservationFilter />
                <ReservationList />
            </MainLayout>
        </>
    )
}