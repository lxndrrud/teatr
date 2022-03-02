import PlayItem from '../PlayItem/PlayItem'
import styles from './PlayList.module.css'

export default function PlayList({plays}) {
    return (
    <div className={styles.posts}>
        {plays && plays.map(play => (
            <PlayItem play={play} key={play.id} />
        ))}
    </div>
    )
}




