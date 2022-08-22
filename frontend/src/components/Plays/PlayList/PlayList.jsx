import PlayItem from '../PlayItem/PlayItem'
import styles from './PlayList.module.css'
//import { useSelector } from 'react-redux'

export default function PlayList({ plays }) {
    //const plays = useSelector(state => state.play.plays)

    return (
        <div className={styles.plays}>
            {
            plays && plays.length > 0 
                ?
                    plays.map(play => (
                        <PlayItem play={play} key={play.id} />
                    ))
                : 
                    <div>
                        Спектакли, удовлетворяющие Вашему запросу, не найдены...
                    </div>
            }
        </div>
    )
}




