import MainLayout from "../../layouts/MainLayout/MainLayout"
import { fetchPlays } from "../../store/actions/playAction"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import PlayPagination from "../../components/Pagination/PlayPagination/PlayPagination"

export default function RepertoirePage() {
    const dispatch = useDispatch()

    useEffect(() => {
        //usePreloader(dispatch, fetchPlays())
        dispatch(fetchPlays())
    }, [dispatch])

    return (
    <div>
        <MainLayout title="Репертуар">
            <PlayPagination />
        </MainLayout>
    </div>
    )
}