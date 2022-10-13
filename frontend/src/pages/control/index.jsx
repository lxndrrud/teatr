import MainLayout from "../../layouts/MainLayout/MainLayout"
import ReservationFilter from "../../components/Filters/ReservationFilter/ReservationFilter"
import ReservationPagination from "../../components/Pagination/ReservationPagination/ReservationPagination"
import { useDispatch, useSelector, useStore } from "react-redux"
import { fetchReservations } from "../../store/actions/reservationAction"
import { useEffect } from "react"
import { checkLogin } from "../../middlewares/authFunctions"
import { useNavigate } from "react-router-dom"

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
    }, [dispatch, navigate, token, store])

    return (
        <div>
            <MainLayout title="Управление бронями">
                <ReservationFilter />
                <ReservationPagination />
            </MainLayout>
        </div>
    )
}