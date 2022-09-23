import PlayItem from '../PlayItem/PlayItem'

export default function PlayList({ plays }) {

    return (
        <div className="lg:ml-[5%] mx-auto sm:ml-0 w-[95%] 
                        flex flex-col flex-wrap 
                        justify-center sm:justify-start 
                        items-center sm:items-start">
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




