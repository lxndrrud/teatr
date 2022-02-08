import MainLayout from "../layouts/MainLayout/MainLayout"
import { useState, useEffect } from "react/cjs/react.development"

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
            
        </MainLayout>
    </>
    )
}