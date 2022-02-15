import MainLayout from '../../layouts/MainLayout/MainLayout'
import ReservationForm from '../../components/ReservationForm/ReservationForm';
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
  const play = useSelector(state => state.play.play)

  
  return (
    <>
      <MainLayout title="Оформление брони">
        <h3>Спектакль: {play.title}</h3>
        <h3>Сеанс: {session.date} {session.time} {session.auditorium_title}</h3>
        <ReservationForm session={ session }/>
      </MainLayout>
    </>
  );
};

export default SessionReservation;
