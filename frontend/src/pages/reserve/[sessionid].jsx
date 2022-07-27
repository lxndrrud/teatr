import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/Forms/ReservationForm/ReservationForm';
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSession } from '../../store/actions/sessionAction'
//import { useRouter } from 'next/router';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector, useStore} from 'react-redux'
//import store from "../../store/store"
import { useEffect, useState } from 'react'
import { clearSlots } from '../../store/actions/reservationAction';
import { checkLogin } from '../../middlewares/authFunctions';

function SessionReservationPage() {
    const navigate = useNavigate()
    //const router = useRouter()
    const dispatch = useDispatch()
    const store = useStore()

    const { idSession } = useParams()
    let token = useSelector(state => state.user.token)
  
  

    useEffect(() => {
        //if(router.isReady) {
        if (!checkLogin(store)) {
            navigate('/login')
            return
        }
        //const { sessionid } = router.query
        if (idSession)
            dispatch(fetchSession(token, idSession))
            .then(dispatch(clearSlots()))
            //.catch(() => router.push('/'))
            .catch(() => navigate('/'))
        //}  
    }, [navigate, dispatch, store, token])

    const sessionFromStore = useSelector(state => state.session.session)

    useEffect( () => {
        if (sessionFromStore.id_play)
          dispatch(fetchPlay(sessionFromStore.id_play))
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
