import PlayItem from '../PlayItem/PlayItem'

export default function PlayList({ plays }) {

    return (
        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start align-items-center w-[100%]">
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




