import MainLayout from "../../layouts/MainLayout/MainLayout"
//import SessionList from "../../components/Sessions/SessionList/SessionList"
import SessionPagination from "../../components/Pagination/SessionPagination/SessionPagination"
import SessionFilter from "../../components/Filters/SessionFilter/SessionFilter"
import { fetchSessions } from '../../store/actions/sessionAction'
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setIsLoading } from "../../store/actions/designAction"

export default function SchedulePage() {
    
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(setIsLoading(true))
            .then(dispatch(fetchSessions()))
            .then(dispatch(setIsLoading(false)))
            //.catch(dispatch(setIsLoading(false)))
       
    }, [dispatch])
    

    /* 

                <SessionList />
    */

    return (
        <div>
            <MainLayout title="Афиша">
                <SessionFilter />
                <SessionPagination />
            </MainLayout>
        </div>
    )
}