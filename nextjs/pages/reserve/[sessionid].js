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
  const { sessionid } = router.query
  const dispatch = useDispatch()
  let [session, setSession] = useState({})
  let [play, setPlay] = useState({})

  useEffect( () => {
      dispatch(fetchSession(sessionid))
      console.log(sessionid)
      setSession(getSession())
      console.log(session)
      dispatch(fetchPlay(session.id_play))
      setPlay(getPlay())
      console.log(play)
  })
  
  
  return (
    <>
      <MainLayout title="Оформление брони">
        <ReservationForm session={ session } play={ play }/>
      </MainLayout>
    </>
  );
};

export default SessionReservation;
