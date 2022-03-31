import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/Forms/ReservationForm/ReservationForm';
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSession } from '../../store/actions/sessionAction'
import { useRouter } from 'next/router';
import { useDispatch, useSelector, useStore} from 'react-redux'
//import store from "../../store/store"
import { useEffect, useState } from 'react'
import { clearSlots } from '../../store/actions/reservationAction';

const SessionReservation = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const store = useStore()
  
  

    useEffect(() => {
        if(router.isReady) {
            if (!(store.getState().user.token && store.getState().user.token.length > 0)) {
                router.push('/login')
                return
            }
            const { sessionid } = router.query
            if (sessionid)
                dispatch(fetchSession(sessionid))
                .then(dispatch(clearSlots()))
        }  
    }, [router.isReady])

    const sessionFromStore = useSelector(state => state.session.session)

    useEffect( () => {
        if (sessionFromStore.id_play)
          dispatch(fetchPlay(sessionFromStore.id_play))
    }, [sessionFromStore])

    const playFromStore = useSelector(state => state.play.play)

    
    
    return (
        <>
          <MainLayout title="Оформление брони">
            <ReservationForm session={ sessionFromStore } play={ playFromStore }/>
          </MainLayout>
        </>
    );
};

export default SessionReservation;
