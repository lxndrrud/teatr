import SessionItem from '../SessionItem/SessionItem.js'
import styles from './SessionList.module.css'
import {useDispatch, useSelector} from 'react-redux'
import store from '../../store/store'
import { useEffect, useState } from 'react'
import { fetchSessions } from '../../store/actions/sessionAction.js'
import { useRouter } from 'next/router'



export default function SessionList() {
    const dispatch = useDispatch()
    const router = useRouter()
    let [sessions, setSessions] = useState([])
    const handleSessions = () => {
        setSessions(store.getState().session.sessions)
    }
    const unsubscribe = store.subscribe(handleSessions)
    useEffect(() => {
        dispatch(fetchSessions)
        setSessions(store.getState().session.sessions) 
    }, [router.isReady])
    //let sessions = useSelector(state => state.session.sessions)

    unsubscribe()
    return (
        <div className={styles.sessions}>
            {sessions && sessions.map(session => (
                <SessionItem session={session} key={session.id} />
            ))}
        </div>
    )

}