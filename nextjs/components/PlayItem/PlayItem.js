import styles from './PlayItem.module.css'
import { CustomLink } from '../CustomLink/CustomLink'


export default function PlayItem({play}) {
    let destinationURL = `/plays/${play.id}`
    return (
    <div className={styles.playItem}>
        <h2>{play.title}</h2>
        <h3>{play.description}</h3>
        <CustomLink destination={destinationURL}/>
    </div>)
}