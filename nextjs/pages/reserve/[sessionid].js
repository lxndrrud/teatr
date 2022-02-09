import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react'

const SessionReservation = () => {
  let [session, setSession] = useState({})
  let [play, setPlay] = useState({})

  const router = useRouter()
  let idSession
  useEffect(async () => {
    const fetchSession= async (idSession_) => {
      const resp = await fetch(`/fastapi/sessions/${idSession_}`)
      const json_ = await resp.json()
      setSession(json_)
    }
    
    if (router.isReady) {
      await fetchSession(router.query.sessionid)
      //fetchPlay(session.id_play)
    }
  }, [router.isReady])
  
  return (
    <>
      <MainLayout title="Оформление брони">
        <ReservationForm idSession={ session.id }/>
      </MainLayout>
    </>
  );
};

export default SessionReservation;
