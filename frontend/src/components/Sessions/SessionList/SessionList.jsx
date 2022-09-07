import SessionItem from '../SessionItem/SessionItem.jsx'

export default function SessionList({ sessions }) {
    return (
        <div className="[@media(min-width:1600px)]:ml-[5%] ml-3 sm:ml-0 w-[95%] 
                        flex flex-col [@media(min-width:1600px)]:flex-row flex-wrap 
                        justify-center [@media(min-width:1600px)]:justify-start
                        items-center">
            {sessions && sessions.length > 0 
                ? 
                    sessions.map(session => (
                        <SessionItem session={session} key={session.id} />
                    ))
                : 
                    <div className='flex flex-row justify-center align-center'>
                        Сеансы, удовлетворяющие Вашим условиям, не найдены...
                    </div>
            }
        </div>
    )
}