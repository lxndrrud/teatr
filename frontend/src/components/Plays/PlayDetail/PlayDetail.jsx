import SessionPagination from '../../Pagination/SessionPagination/SessionPagination'
import { useSelector } from "react-redux"
import DetailImage from "../../UI/Images/DetailImage/DetailImage"
import Preloader from '../../UI/Preloader/Preloader'



export default function PlayDetail({ images}) {
    const { play, isLoading } = useSelector(state => state.play)
    if (isLoading) return <Preloader />
    return (
        <div className="flex flex-col w-[100%] lg:w-[90%]">
            <div className="w-[100%] my-3 sm:mt-0
                            flex flex-col lg:flex-row 
                            justify-center align-center lg:justify-start 
                            items-center lg:items-start">
                <DetailImage filepath={play.poster_filepath} altDescription={play.title} />
                <table className="m-4 p-1 [@media(max-width:640px)]:text-[15px]"> 
                    <tbody>
                        {
                            play.crew && play.crew.map(crewPerson => (
                                <tr>
                                    <td className="text-[slategrey]">{crewPerson.split(' - ')[0]}</td>
                                    <td className="pl-2">{crewPerson.split(' - ')[1]}</td>
                                </tr>
                            ))
                        }
                    </tbody>  
                   
                </table>
            </div>
            <div className="w-[90%] sm:w-[100%] mx-auto mt-3 sm:mx-0">
                {
                    play.description && play.description.map(paragraph => (
                        <h2 className="mt-2 text-justify">{paragraph}</h2>
                    ))
                }
            </div>
            <div className="w-[100%] mt-3 lg:ml-[75px]">
                <SessionPagination itemsPerPage={3} />
            </div>
        </div>
    )
    
}