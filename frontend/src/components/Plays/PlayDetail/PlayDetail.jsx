import CardImage from "../../UI/Images/CardImage/CardImage"
import SessionPagination from '../../Pagination/SessionPagination/SessionPagination'
import { useSelector } from "react-redux"



export default function PlayDetail({ images}) {
    const play = useSelector(state => state.play.play)

    return (
        <div className="flex flex-col w-[100%]">
            <div className="flex flex-col sm:flex-row w-[100%] justify-start">
                <CardImage filepath={play.poster_filepath} altDescription={play.title} />
                <h2 className="ml-0 mt-3 sm:ml-[10%] sm:mt-0">{play.description}</h2>
            </div>
            <div className="w-[100%] mt-3">
                <SessionPagination itemsPerPage={3} />
            </div>
            
        </div>
    )
    
}