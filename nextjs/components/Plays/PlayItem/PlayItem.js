import styles from './PlayItem.module.css'
import { ButtonLink } from '../../UI/ButtonLink/ButtonLink'


export default function PlayItem({play}) {
    let destinationURL = `/repertoire/${play.id}`
    return (
    <div className={styles.playItem}>
        <p className={styles.playTitle}>{play.title}</p>
        <p className={styles.playDescription}>{play.description.slice(0, 50)}</p>
        <ButtonLink destination={destinationURL} 
            styleClass={styles.playButton} text="Посмотреть"/>
    </div>)
}