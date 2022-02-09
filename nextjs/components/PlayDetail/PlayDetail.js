import styles from "./PlayDetail.module.css"


export default function PlayDetail({ play, images}) {

    return (
        <div className={styles.container}>
            <h2>{play.description}</h2>
        </div>
    )
    
}