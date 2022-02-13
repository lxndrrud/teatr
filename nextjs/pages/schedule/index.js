import MainLayout from "../../layouts/MainLayout/MainLayout"
import SessionList from "../../components/SessionList/SessionList"
import { fetchSessions } from '../../store/actions/sessionAction'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Shedule() {
    //let [sessions, setSessions] = useState([])
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(fetchSessions())
    }, [])

    const sessions = useSelector(state => state.session.sessions)
    
    return (
    <>
        <MainLayout title="Расписание">
            <SessionList sessions={sessions} />
        </MainLayout>
    </>
    )
}