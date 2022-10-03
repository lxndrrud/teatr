import PlayItem from '../PlayItem/PlayItem'
import { useSelector } from 'react-redux'
import Preloader from '../../UI/Preloader/Preloader'

export default function PlayList({ plays }) {
    let { isLoading } = useSelector(state => state.play)
    return (
        <div className="lg:ml-[5%] mx-auto sm:ml-0 w-[95%] 
                        flex flex-col flex-wrap 
                        justify-center sm:justify-start 
                        items-center sm:items-start">
            {
                isLoading
                    ?
                        <Preloader />
                    :
                        (plays && plays.length > 0 
                            ?
                                plays.map(play => (
                                    <PlayItem play={play} key={play.id} />
                                ))
                            : 
                                <div>
                                    Доступные спектакли не найдены...
                                </div>)
            }
        </div>
    )
}




