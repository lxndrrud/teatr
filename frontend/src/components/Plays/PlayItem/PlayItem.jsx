import ButtonLink from '../../UI/ButtonLink/ButtonLink'
import CardImage from '../../UI/Images/CardImage/CardImage'
import IconSVG from '../../UI/IconSVG/IconSVG'
import CustomLink from '../../UI/CustomLink/CustomLink'


export default function PlayItem({ play }) {
    let destinationURL = `/repertoire/${play.id}`
    /*
    <div className='ml-3'>
        <ButtonLink destination={destinationURL} 
            linkType="blue" text="Посмотреть"/>
    </div>
    */
    return (
    <div className="bg-[#eeeeee] p-3 mr-[2%] mt-[1.6%] 
                    w-[90%]  
                    shadow-xl hover:shadow-2xl 
                    flex flex-col items-center
                    border border-solid border-[black] rounded-md" >
        
        <div className="flex flex-col sm:flex-row [@media(max-width:640px)]:items-center">
            <CardImage filepath={play.poster_filepath} 
                    altDescription={`Здесь должен был быть постер спектакля "${play.title}"...`} />
            <div className="ml-3 mt-[30px] sm:mt-0 flex flex-col">
                <p className="text-[22px] font-bold text-center sm:text-start">
                    <CustomLink text={play.title} destination={destinationURL}/>
                </p>
                <div className="hidden sm:block mt-1 flex-row justify-center">
                    <span className="mr-[7px] float-left">
                        <IconSVG 
                            data="M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
                    </span>
                    <p className="text-[20px] inline">
                        {play.description[0]}
                    </p>
                </div>
            </div>
        </div>
        
       
    </div>)
}