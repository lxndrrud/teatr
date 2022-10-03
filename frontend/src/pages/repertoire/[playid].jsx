import MainLayout from "../../layouts/MainLayout/MainLayout"
import PlayDetail from "../../components/Plays/PlayDetail/PlayDetail"
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSessionsByPlay } from "../../store/actions/sessionAction"
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { usePreloader } from "../../hooks/usePreloader"
import Preloader from "../../components/UI/Preloader/Preloader"

export default function PlayPage() {
    const dispatch = useDispatch()
    const { idPlay } = useParams()
    //let { isLoading } = useSelector(state => state.design)
    useEffect(() => {
        dispatch(fetchPlay({ idPlay }))
        dispatch(fetchSessionsByPlay(idPlay))
    }, [dispatch])

    const { play } = useSelector(state => state.play)

    return (
        <div>
            <MainLayout title={play.title}>
                <PlayDetail />
            </MainLayout>
        </div>
    )
}