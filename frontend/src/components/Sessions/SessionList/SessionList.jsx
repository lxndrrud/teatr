import SessionItem from '../SessionItem/SessionItem.jsx'
import styles from './SessionList.module.css'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'

export default function SessionList({ sessions }) {
    console.log(sessions)
    /*
    let [items, setItems] = useState([])
    useEffect(() => {
        const itemsList = []
        console.log(ses)
        if (sessions) 
            sessions.forEach(session => {
                itemsList.push(
                    <SessionItem session={session} key={session.id} />
                )
            })
        setItems(itemsList)
        console.log(items)
    }, [])
    */

    return (
        <div className={styles.sessions}>
            {sessions && sessions.map(session => (
                <SessionItem session={session} key={session.id} />
            ))}
        </div>
    )
}