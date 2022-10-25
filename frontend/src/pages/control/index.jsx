import MainLayout from "../../layouts/MainLayout/MainLayout"
import ReservationFilter from "../../components/Filters/ReservationFilter/ReservationFilter"
import ReservationPagination from "../../components/Pagination/ReservationPagination/ReservationPagination"
import { useDispatch, useSelector, useStore } from "react-redux"
import { fetchReservations } from "../../store/actions/reservationAction"
import { useEffect } from "react"
import { checkLogin } from "../../middlewares/authFunctions"
import { useNavigate } from "react-router-dom"
import { reservationReducer } from "../../store/reducers/reservationReducer"
import Swal from 'sweetalert2'

export default function ControlIndexPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const navigate = useNavigate()

    let token = useSelector(state => state.user.token)

    useEffect(() => {
        if(!checkLogin(store)) {
            navigate('/login')
            return
        }
        dispatch(fetchReservations({ token }))
        const errorReservation = store.getState().reservation.error
        if (errorReservation) {
            Swal.fire({
                title: 'Произошла ошибка!',
                text: errorReservation,
                icon: 'error'
            })
            dispatch(reservationReducer.actions.clearError())
            return
        }
    }, [dispatch, navigate, token, store])

    return (
        <div>
            <MainLayout title="Управление бронями">
                <div className="w-full">
                    <ReservationFilter />
                    <ReservationPagination />
                </div>
            </MainLayout>
        </div>
    )
}