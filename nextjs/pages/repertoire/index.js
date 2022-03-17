import MainLayout from "../../layouts/MainLayout/MainLayout"
import PlayList from "../../components/PlayList/PlayList"
import { fetchPlays } from "../../store/actions/playAction"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

export default function Repertoire() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPlays())
    }, [])

    return (
    <>
        <MainLayout title="Репертуар">
            <PlayList />
        </MainLayout>
    </>
    )
}