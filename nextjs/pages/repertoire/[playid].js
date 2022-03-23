import MainLayout from "../../layouts/MainLayout/MainLayout"
import PlayDetail from "../../components/Plays/PlayDetail/PlayDetail"
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSessionsByPlay } from "../../store/actions/sessionAction"
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function PlayPage() {
    const dispatch = useDispatch()
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            dispatch(fetchPlay(router.query.playid))
            dispatch(fetchSessionsByPlay(router.query.playid))
        }
    }, [router.isReady])

    const play = useSelector(state => state.play.play)
    const sessions = useSelector(state => state.session.sessions)    

    return (
        <>
            <MainLayout title={play.title}>
                <PlayDetail play={play} sessions={sessions}/>
            </MainLayout>
        </>
    )
}