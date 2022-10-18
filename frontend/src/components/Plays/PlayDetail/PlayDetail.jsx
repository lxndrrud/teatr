import { useState } from 'react'
import SessionPagination from '../../Pagination/SessionPagination/SessionPagination'
import { useSelector } from "react-redux"
import DetailImage from "../../UI/Images/DetailImage/DetailImage"
import Preloader from '../../UI/Preloader/Preloader'
import CustomButton from '../../UI/CustomButton/CustomButton'


function ShowDescriptionButton({ showDescription, setShowDescription }) {
    return (
        <div className='mt-3 w-full flex justify-center align-center'>
            <div className='lg:ml-[150px] w-[max-content]'>
                <CustomButton 
                    onClickHook={() => setShowDescription(!showDescription)} 
                    value={ showDescription ? "Скрыть описание": "Показать описание" }
                />
            </div>
        </div>)
}

export default function PlayDetail({ images }) {
    const { play, isLoading } = useSelector(state => state.play)
    let [showDescription, setShowDescription] = useState(false)
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
            <ShowDescriptionButton  
                showDescription={showDescription} 
                setShowDescription={setShowDescription} 
            />
            {
                showDescription 
                && 
                <div>
                    <div className="w-[90%] sm:w-[100%] mx-auto mt-3 sm:mx-0">
                        {
                            play.description && play.description.map(paragraph => (
                                <h2 className="mt-3 text-justify">{paragraph}</h2>
                            ))
                        }
                    </div>
                    <ShowDescriptionButton  
                        showDescription={showDescription} 
                        setShowDescription={setShowDescription} 
                    />
                </div>
            }
            <div className="w-[100%] mt-3 lg:ml-[75px]">
                <SessionPagination itemsPerPage={3} />
            </div>
        </div>
    )
    
}