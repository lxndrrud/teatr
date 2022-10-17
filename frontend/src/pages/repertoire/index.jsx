import MainLayout from "../../layouts/MainLayout/MainLayout"
import { fetchPlays } from "../../store/actions/playAction"
import { useDispatch, useStore } from "react-redux"
import { useEffect } from "react"
import PlayPagination from "../../components/Pagination/PlayPagination/PlayPagination"
import Swal from "sweetalert2"
import { playReducer } from "../../store/reducers/playReducer"

export default function RepertoirePage() {
    const dispatch = useDispatch()
    const store = useStore()

    useEffect(() => {
        dispatch(fetchPlays())
        .then(() => {
            const errorPlay = store.getState().play.error
            if (errorPlay) {
                Swal.fire({
                    title: "Произошла ошибка!",
                    text: errorPlay,
                    icon: 'error'
                })
                dispatch(playReducer.actions.clearError())
                return
            }
        })
        
    }, [dispatch])

    return (
    <div>
        <MainLayout title="Репертуар">
            <PlayPagination />
        </MainLayout>
    </div>
    )
}