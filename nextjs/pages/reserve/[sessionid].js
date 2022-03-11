import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSession } from '../../store/actions/sessionAction'
import { useRouter } from 'next/router';
import { useDispatch, useSelector, useStore} from 'react-redux'
//import store from "../../store/store"
import { useEffect, useState } from 'react'

/*
const getSession = () => { 
  return store.getState().session.session
}

const getPlay = () => {
  return store.getState().play.play
}
*/

const SessionReservation = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const store = useStore()
  /*
  let [session, setSession] = useState({})
  let [play, setPlay] = useState({})
  */
  

  useEffect(() => {
    if(router.isReady) {
      const { sessionid } = router.query
      if (sessionid)
        dispatch(fetchSession(sessionid))
    }
    
    //setSession(store.getState().session.session)
    //console.log(session)
      
  }, [router.isReady])

  const sessionFromStore = useSelector(state => state.session.session)

  useEffect( () => {
    if (sessionFromStore.id_play)
      dispatch(fetchPlay(sessionFromStore.id_play))
    //setPlay(store.getState().play.play)
    //console.log(play)
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
