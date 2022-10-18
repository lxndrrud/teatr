import { useEffect } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationDetail from "../../components/Reservations/ReservationDetail/ReservationDetail"
import { fetchReservation } from '../../store/actions/reservationAction'
import { checkLogin } from '../../middlewares/authFunctions'
import { useNavigate, useParams } from 'react-router-dom'
import Preloader from '../../components/UI/Preloader/Preloader'
import { reservationReducer } from '../../store/reducers/reservationReducer'
import swal from 'sweetalert2'


function ReservationDetailPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()

    const { idReservation } = useParams()
    let token = useSelector(state => state.user.token)
    let isLoading = useSelector(state => state.reservation.isLoading)

    useEffect(() => {
        if (!checkLogin(store)) {
            navigate('/login')
            return
        }
        if (idReservation) {
            dispatch(fetchReservation({token, idReservation}))
            .then(() => {
                const errorReservation = store.getState().reservation.error
                if (errorReservation) {
                    swal.fire({
                        title: 'Произошла ошибка!',
                        text: errorReservation,
                        icon: 'error'
                    })
                    dispatch(reservationReducer.actions.clearError())
                    return
                }
            })
        }
    }, [navigate, store, dispatch, token])

    const reservation = useSelector(state => state.reservation.reservation)

    return (
        <>
            <MainLayout title={`Информация о брони`}>
                {
                    isLoading
                    ?
                        <Preloader />
                    :
                        <ReservationDetail reservation={reservation} />
                }
            </MainLayout>
        </>
    )
}

export default ReservationDetailPage;