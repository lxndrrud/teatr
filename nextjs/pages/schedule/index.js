import MainLayout from "../../layouts/MainLayout/MainLayout"
import SessionList from "../../components/SessionList/SessionList"
import SessionFilter from "../../components/Filters/SessionFilter/SessionFilter"
import { fetchSessions } from '../../store/actions/sessionAction'
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Schedule() {
    
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(fetchSessions())
    }, [])
    

    return (
    <>
        <MainLayout title="Расписание">
            <SessionFilter />
            <SessionList />
        </MainLayout>
    </>
    )
}