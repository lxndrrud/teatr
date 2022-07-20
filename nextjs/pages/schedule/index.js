import MainLayout from "../../layouts/MainLayout/MainLayout"
import SessionList from "../../components/Sessions/SessionList/SessionList"
import SessionFilter from "../../components/Filters/SessionFilter/SessionFilter"
import { fetchSessions } from '../../store/actions/sessionAction'
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Schedule() {
    
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(fetchSessions())
    }, [dispatch])
    

    return (
    <>
        <MainLayout title="Расписание">
            <SessionFilter />
            <SessionList />
        </MainLayout>
    </>
    )
}