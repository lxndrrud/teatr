
import { useEffect } from 'react'
//import { useRouter } from "next/router"
import { useSelector, useDispatch, useStore } from 'react-redux'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationDetail from "../../components/Reservations/ReservationDetail/ReservationDetail"
import { fetchReservation } from '../../store/actions/reservationAction'
import { checkLogin } from '../../middlewares/authFunctions'
import { useNavigate, useParams } from 'react-router-dom'


function ReservationDetailPage() {
    const navigate = useNavigate()
    //const router = useRouter()
    const dispatch = useDispatch()
    const store = useStore()

    const { idReservation } = useParams()
    let token = useSelector(state => state.user.token)

    useEffect(() => {
        //if (router.isReady) {
            if (!checkLogin(store)) {
                navigate('/login')
                return
            }
            //const { reservationid } = router.query
            if (idReservation) {
                dispatch(fetchReservation({ 
                    token: token,
                    id_reservation: idReservation
                }))
                .catch(() => navigate('/control'))
            }
        //}
    }, [navigate, store, dispatch, token])

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