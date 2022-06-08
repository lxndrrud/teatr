import styles from './PlayItem.module.css'
import { ButtonLink } from '../../UI/ButtonLink/ButtonLink'
import CardImage from '../../UI/Images/CardImage/CardImage'


export default function PlayItem({ play }) {
    let destinationURL = `/repertoire/${play.id}`
    return (
    <div className={styles.playItem}>
        <p className={styles.playTitle}>{play.title}</p>
        <div className={styles.rowContainer}>
            <div className={styles.columnContainer}>
                <CardImage filepath={play.poster_filepath} 
                    altDescription={`Здесь должен был быть постер спектакля "${play.title}"...`} />
            </div>

            <div className={styles.columnContainer}>
                
                <p className={styles.playDescription}>
                    <svg style={{width:"24px", height: "24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px" }}>
                        <path fill="#000" d="M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
                    </svg>
                    {play.description.slice(0, 50)}
                </p>
                <ButtonLink destination={destinationURL} 
                    linkType="blue" text="Посмотреть"/>
            </div>
        </div>
        
       
    </div>)
}