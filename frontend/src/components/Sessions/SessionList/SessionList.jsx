import { useSelector } from 'react-redux'
import Preloader from '../../UI/Preloader/Preloader.jsx'
import SessionItem from '../SessionItem/SessionItem.jsx'

export default function SessionList({ sessions }) {
    let isLoading = useSelector(state => state.session.isLoading)
    return (
        <div className="[@media(min-width:1600px)]:ml-[1%] mx-auto sm:mx-0 w-[95%] sm:w-[99%]
                        flex flex-col [@media(min-width:1600px)]:flex-row flex-wrap 
                        justify-center [@media(min-width:1600px)]:justify-start
                        items-center">
            {
                isLoading
                ?
                    <div className='flex w-full lg:ml-[55px]'>
                        <Preloader />
                    </div>
                :
                    (sessions && sessions.length > 0 
                        ? 
                            sessions.map(session => (
                                <SessionItem session={session} key={session.id} />
                            ))
                        : 
                            <div className='flex flex-row justify-center align-center'>
                                Сеансы, удовлетворяющие Вашим условиям, не найдены...
                            </div>)
            }
        </div>
    )
}