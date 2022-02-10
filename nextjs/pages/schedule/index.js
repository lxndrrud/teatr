import MainLayout from "../../layouts/MainLayout/MainLayout"
import SessionList from "../../components/SessionList/SessionList"
import { useEffect, useState } from "react"

export default function Shedule() {
    let [sessions, setSessions] = useState([])
    useEffect(() => {
        const fetchSessions = async () => {
            const response = await fetch('/fastapi/sessions')
            const json_ = await response.json()
            setSessions(json_)
        }
        fetchSessions()
    }, [])
    

    return (
    <>
        <MainLayout title="Расписание">
            <SessionList sessions={sessions} />
        </MainLayout>
    </>
    )
}