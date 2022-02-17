import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import { fetchPlay } from "../../store/actions/playAction"
import { fetchSession } from '../../store/actions/sessionAction'
import { useRouter } from 'next/router';
import { useDispatch, useSelector} from 'react-redux'
import { useEffect } from 'react'

const SessionReservation = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect( () => {
    if (router.isReady) {
      dispatch(fetchSession(router.query.sessionid))
    }
  }, [router.isReady])

  const session = useSelector(state => state.session.session)
  useEffect(() => {
    dispatch(fetchPlay(session.id_play))
  }, [session])
  
  const play = useSelector(state => state.play.play)

  
  return (
    <>
      <MainLayout title="Оформление брони">
        <ReservationForm session={ session } play={ play }/>
      </MainLayout>
    </>
  );
};

export default SessionReservation;
