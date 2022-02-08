import PlayItem from '../PlayItem/PlayItem'

export default function PlayList({plays}) {
    console.log(plays)
    return (
    <div>
        {plays && plays.map(play => (
            <PlayItem play={play} key={play.id}></PlayItem>
        ))}
    </div>
    )
}




