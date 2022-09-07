import ButtonLink from '../../UI/ButtonLink/ButtonLink'
import CardImage from '../../UI/Images/CardImage/CardImage'
import IconSVG from '../../UI/IconSVG/IconSVG'


export default function PlayItem({ play }) {
    let destinationURL = `/repertoire/${play.id}`
    return (
    <div className="bg-[#eeeeee] p-3 mr-[2%] mt-[1.6%] 
                    w-[100%] lg:w-[30%] 
                    shadow-xl hover:shadow-2xl 
                    flex flex-col
                    border border-solid border-[black] rounded-md">
        <p className="text-[26px] font-bold">{play.title}</p>
        <div className="flex flex-col sm:flex-row">
            <div className="mt-[20px] sm:mt-0 
                            flex justify-center sm:justify-start">
                <CardImage filepath={play.poster_filepath} 
                    altDescription={`Здесь должен был быть постер спектакля "${play.title}"...`} />
            </div>

            <div className="mt-[30px] sm:mt-0 flex flex-col justify-between">
                <div className="flex flex-row justify-start">
                    <div className="ml-3 mr-[7px]">
                        <IconSVG 
                            data="M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
                    </div>
                    <p className="text-[20px]">
                        {play.description.slice(0, 50)}
                    </p>
                </div>
                <div className='ml-3'>
                    <ButtonLink destination={destinationURL} 
                        linkType="blue" text="Посмотреть"/>
                </div>
            </div>
        </div>
        
       
    </div>)
}