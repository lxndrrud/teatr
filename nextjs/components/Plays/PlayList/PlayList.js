import PlayItem from '../PlayItem/PlayItem'
import styles from './PlayList.module.css'
import { useSelector } from 'react-redux'

export default function PlayList() {
    const plays = useSelector(state => state.play.plays)

    return (
        <div className={styles.plays}>
            {plays && plays.map(play => (
                <PlayItem play={play} key={play.id} />
            ))}
        </div>
    )
}




