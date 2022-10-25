import MainLayout from "../../layouts/MainLayout/MainLayout"
import SessionPagination from "../../components/Pagination/SessionPagination/SessionPagination"
import SessionFilter from "../../components/Filters/SessionFilter/SessionFilter"
import { fetchSessions } from '../../store/actions/sessionAction'
import { useEffect } from "react"
import { useDispatch, useStore } from "react-redux"
import Swal from "sweetalert2"
import { sessionReducer } from "../../store/reducers/sessionReducer"

export default function SchedulePage() {
    const dispatch = useDispatch()
    const store = useStore()
    
    useEffect(() => {
        dispatch(fetchSessions())
        .then(() => {
            const errorSession = store.getState().session.error
            if (errorSession) {
                Swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorSession,
                    icon: "error"
                })
                dispatch(sessionReducer.actions.clearError())
                return
            }
        })
        
    }, [dispatch])

    return (
        <div>
            <MainLayout title="Афиша">
                <div className="w-full">
                    <SessionFilter />
                    <SessionPagination />
                </div>
            </MainLayout>
        </div>
    )
}