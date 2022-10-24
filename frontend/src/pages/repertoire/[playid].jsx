import MainLayout from "../../layouts/MainLayout/MainLayout"
import PlayDetail from "../../components/Plays/PlayDetail/PlayDetail"
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSessionsByPlay } from "../../store/actions/sessionAction"
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { playReducer } from '../../store/reducers/playReducer'
import { sessionReducer } from '../../store/reducers/sessionReducer'
import Swal from "sweetalert2"

export default function PlayPage() {
    const dispatch = useDispatch()
    const store = useStore()
    const navigate = useNavigate()
    const { idPlay } = useParams()
    useEffect(() => {
        dispatch(fetchPlay({ idPlay }))
        .then(() => {
            const errorPlay = store.getState().play.error
            if (errorPlay) {
                Swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorPlay,
                    icon: 'error'
                })
                dispatch(playReducer.actions.clearError())
                navigate("/repertoire")
            }   
        })
        dispatch(fetchSessionsByPlay({ idPlay }))
        .then(() => {
            const errorSession = store.getState().session.error
            if (errorSession) {
                Swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorSession,
                    icon: 'error'
                })
                dispatch(sessionReducer.actions.clearError())
                navigate("/repertoire")
            }
        })
    }, [dispatch])

    const { play } = useSelector(state => state.play)

    return (
        <div>
            <MainLayout title={play.title}>
                <PlayDetail />
            </MainLayout>
        </div>
    )
}