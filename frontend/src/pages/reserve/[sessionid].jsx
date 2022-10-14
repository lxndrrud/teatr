import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/Forms/ReservationForm/ReservationForm';
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSession } from '../../store/actions/sessionAction'
//import { useRouter } from 'next/router';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector, useStore} from 'react-redux'
//import store from "../../store/store"
import { useEffect } from 'react'
import { checkLogin } from '../../middlewares/authFunctions';
import swal from 'sweetalert2'
import { reservationReducer } from '../../store/reducers/reservationReducer';

function SessionReservationPage() {
    const navigate = useNavigate()
    //const router = useRouter()
    const dispatch = useDispatch()
    const store = useStore()

    const { idSession } = useParams()
    let token = useSelector(state => state.user.token)
    let errorPlay = useSelector(state => state.play.error)
    let errorSession = useSelector(state => state.session.error)
    let errorReservation = useSelector(state => state.reservation.error)
  
  

    useEffect(() => {
        //if(router.isReady) {
        if (!checkLogin(store)) {
            navigate('/login')
        } else {
            //const { sessionid } = router.query
            if (idSession) {
                dispatch(fetchSession({ token, idSession }))
                if (errorSession) {
                    swal.fire({
                        title: 'Произошла ошибка!',
                        title: errorSession,
                        icon: 'error'
                    })
                }
                dispatch(reservationReducer.actions.clearSlots())
                if (errorReservation) {
                    swal.fire({
                        title: 'Произошла ошибка',
                        text: errorReservation,
                        icon: 'error'
                    })
                }
            }
        }
        
        //}  
    }, [navigate, dispatch, store, token])

    const sessionFromStore = useSelector(state => state.session.session)

    useEffect( () => {
        if (sessionFromStore.id_play) {
            dispatch(fetchPlay({ idPlay: sessionFromStore.id_play }))
            if (errorPlay) {
                swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorPlay,
                    icon: 'error'
                })
            }
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
