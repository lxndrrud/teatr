import styles from './PlayItem.module.css'
import { ButtonLink } from '../../UI/ButtonLink/ButtonLink'
import CardImage from '../../UI/Images/CardImage/CardImage'


export default function PlayItem({ play }) {
    let destinationURL = `/repertoire/${play.id}`
    return (
    <div className={styles.playItem}>
        <p className={styles.playTitle}>{play.title}</p>
        <CardImage filepath={play.poster_filepath} 
            altDescription={`Здесь должен был быть постер спектакля "${play.title}"...`} />
        <p className={styles.playDescription}>{play.description.slice(0, 50)}</p>
        <ButtonLink destination={destinationURL} 
            linkType="green" text="Посмотреть"/>
    </div>)
}