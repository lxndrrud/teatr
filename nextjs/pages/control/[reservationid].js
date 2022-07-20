
import { useEffect } from 'react'
import { useRouter } from "next/router"
import { useSelector, useDispatch, useStore } from 'react-redux'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationDetail from "../../components/Reservations/ReservationDetail/ReservationDetail"
import { fetchReservation } from '../../store/actions/reservationAction'
import { checkLogin } from '../../middlewares/auth'


const ReservationDetailPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const store = useStore()
    let token = useSelector(state => state.user.token)

    useEffect(() => {
        if (router.isReady) {
            if (!checkLogin(store)) {
                router.push('/login')
                return
            }
            const { reservationid } = router.query
            if (reservationid) {
                dispatch(fetchReservation({ 
                    token: token,
                    id_reservation: reservationid 
                }))
                .catch(() => router.push('/control'))
            }
        }
    }, [router, store, dispatch, token])

    const reservation = useSelector(state => state.reservation.reservation)

    return (
        <>
            <MainLayout title={`Информация о брони`}>
                <ReservationDetail reservation={reservation} />
            </MainLayout>
        </>
    )
}

export default ReservationDetailPage;