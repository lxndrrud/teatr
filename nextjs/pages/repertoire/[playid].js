import MainLayout from "../../layouts/MainLayout/MainLayout"
import PlayDetail from "../../components/PlayDetail/PlayDetail"
import SessionList from "../../components/SessionList/SessionList"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function PlayPage() {
    let [play, setPlay] = useState({})
    let [sessions, setSessions] = useState([])
    const router = useRouter()
    useEffect(() => {
        const fetchPlay = async (playid_) => {
            const resp = await fetch(`/fastapi/plays/${playid_}`)
            const json_ = await resp.json()
            setPlay(json_)
        }
        const fetchSessionsByPlay = async (playid_) => {
            const resp = await fetch(`/fastapi/sessions/play/${playid_}`)
            const json_ = await resp.json()
            setSessions(json_)
        }
        
        if (router.isReady) {
            fetchPlay(router.query.playid)
            fetchSessionsByPlay(router.query.playid)
        }
    }, [router.isReady])

    return (
        <>
            <MainLayout title={play.title}>
                <PlayDetail play={play} />
                <SessionList sessions={sessions} />
            </MainLayout>
        </>
    )
}