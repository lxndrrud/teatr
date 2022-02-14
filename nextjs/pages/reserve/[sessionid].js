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

  
  return (
    <>
      <MainLayout title="Оформление брони">
        <ReservationForm session={ session }/>
      </MainLayout>
    </>
  );
};

export default SessionReservation;
