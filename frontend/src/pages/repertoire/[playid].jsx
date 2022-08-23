import MainLayout from "../../layouts/MainLayout/MainLayout"
import PlayDetail from "../../components/Plays/PlayDetail/PlayDetail"
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSessionsByPlay } from "../../store/actions/sessionAction"
import { useDispatch, useSelector } from 'react-redux'
//import { useRouter } from "next/router"
import { useParams } from "react-router-dom"
import { useEffect } from "react"

export default function PlayPage() {
    const dispatch = useDispatch()
    //const router = useRouter()
    const { idPlay } = useParams()
    useEffect(() => {
        //if (router.isReady) {
            dispatch(fetchPlay(idPlay))
            dispatch(fetchSessionsByPlay(idPlay))
        //}
    }, [dispatch])

    const play = useSelector(state => state.play.play)

    return (
        <div>
            <MainLayout title={play.title}>
                <PlayDetail />
            </MainLayout>
        </div>
    )
}