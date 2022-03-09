import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSession } from '../../store/actions/sessionAction'
import { useRouter } from 'next/router';
import { useDispatch, useSelector} from 'react-redux'
import store from "../../store/store"
import { useEffect, useState } from 'react'

const getSession = () => { 
  return store.getState().session.session
}

const getPlay = () => {
  return store.getState().play.play
}

const SessionReservation = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  let [session, setSession] = useState({})
  let [play, setPlay] = useState({})

  useEffect( () => {
    if (router.isReady) {
      dispatch(fetchSession(router.query.sessionid))
      setSession(getSession())
    }
  }, [router.isReady])

  useEffect(() => {
    dispatch(fetchPlay(session.id_play))
    setPlay(getPlay())
  }, [session])
  
  
  return (
    <>
      <MainLayout title="Оформление брони">
        <ReservationForm session={ session } play={ play }/>
      </MainLayout>
    </>
  );
};

export default SessionReservation;
