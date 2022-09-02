import PlayItem from '../PlayItem/PlayItem'

export default function PlayList({ plays }) {

    return (
        <div className="[@media(min-width:1600px)]:ml-[5%] w-[95%] 
                        flex flex-col [@media(min-width:1600px)]:flex-row flex-wrap 
                        justify-center [@media(min-width:1600px)]:justify-start 
                        items-center">
            {
            plays && plays.length > 0 
                ?
                    plays.map(play => (
                        <PlayItem play={play} key={play.id} />
                    ))
                : 
                    <div>
                        Доступные спектакли не найдены...
                    </div>
            }
        </div>
    )
}




