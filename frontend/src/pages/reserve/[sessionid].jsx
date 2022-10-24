import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/Forms/ReservationForm/ReservationForm';
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSession } from '../../store/actions/sessionAction'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector, useStore} from 'react-redux'
import { useEffect } from 'react'
import { checkLogin } from '../../middlewares/authFunctions';
import Swal from 'sweetalert2'
import { reservationReducer } from '../../store/reducers/reservationReducer';
import { playReducer } from '../../store/reducers/playReducer';
import { sessionReducer } from '../../store/reducers/sessionReducer';

function SessionReservationPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()

    const { idSession } = useParams()
    let token = useSelector(state => state.user.token)

    useEffect(() => {
        if (!checkLogin(store)) {
            navigate('/login')
            return
        }
        if (idSession) {
            dispatch(fetchSession({ token, idSession }))
            .then(() => {
                const errorSession = store.getState().session.error
                if (errorSession) {
                    Swal.fire({
                        title: 'Произошла ошибка!',
                        text: errorSession,
                        icon: 'error'
                    })
                    dispatch(sessionReducer.actions.clearError())
                    navigate('/schedule')
                }
                dispatch(reservationReducer.actions.clearSlots())
            })
        }
    }, [navigate, dispatch, store, token])

    const sessionFromStore = useSelector(state => state.session.session)

    useEffect( () => {
        if (sessionFromStore.id_play) {
            dispatch(fetchPlay({ idPlay: sessionFromStore.id_play }))
            .then(() => {
                const errorPlay = store.getState().play.error
                if (errorPlay) {
                    Swal.fire({
                        title: 'Произошла ошибка!',
                        text: errorPlay,
                        icon: 'error'
                    })
                    dispatch(playReducer.actions.clearError())
                    navigate('/schedule')
                }
            })
            
        }
    }, [sessionFromStore, dispatch])

    const playFromStore = useSelector(state => state.play.play)
    
    return (
        <>
            <MainLayout title="Оформление брони">
                <ReservationForm session={ sessionFromStore } play={ playFromStore }/>
            </MainLayout>
        </>
    );
};

export default SessionReservationPage;
