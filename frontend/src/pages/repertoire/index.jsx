import MainLayout from "../../layouts/MainLayout/MainLayout"
import { fetchPlays } from "../../store/actions/playAction"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import PlayPagination from "../../components/Pagination/PlayPagination/PlayPagination"
import { setIsLoading } from "../../store/actions/designAction"

export default function RepertoirePage() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIsLoading(true))
            .then(dispatch(fetchPlays()))
            .then(dispatch(setIsLoading(false)))
        
    }, [dispatch])

    return (
    <div>
        <MainLayout title="Репертуар">
            <PlayPagination />
        </MainLayout>
    </div>
    )
}