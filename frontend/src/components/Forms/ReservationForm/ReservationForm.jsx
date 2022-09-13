import ReservationPostForm from "../ReservationPostForm/ReservationPostForm"
import { useSelector } from "react-redux"


function ReservationForm() {
    let play = useSelector(state => state.play.play)
    let session = useSelector(state => state.session.session)

    return (
        <>
            <div className="p-2 text-[18px] flex flex-row justify-center rounded">
                <table className="border-separate border-2 border-solid rounded-md">
                    <tbody>
                        <tr>
                            <td className="p-1 border-t-[none] border-l-[none]">Спектакль</td>
                            <td className="p-1 border-t-[none] border-l-[2px]">{play.title}</td>
                        </tr>
                        <tr>
                            <td className="p-1 border-t-[2px] border-l-[none]">Дата и время</td>
                            <td className="p-1 border-t-[2px] border-l-[2px]">{session.timestamp}</td>
                        </tr>
                        <tr>
                            <td className="p-1 border-t-[2px] border-l-[none]">Зал</td>
                            <td className="p-1 border-t-[2px] border-l-[2px]">{session.auditorium_title}</td>
                        </tr>
                        <tr>
                            <td className="p-1 border-t-[2px] border-l-[none]">Максимум мест для брони</td>
                            <td className="p-1 border-t-[2px] border-l-[2px]">{session.max_slots}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <form className="w-[100%] mt-2">
                <ReservationPostForm />
            </form>

        </>
        
    )
};

export default ReservationForm;
