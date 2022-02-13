import MainLayout from "../../layouts/MainLayout/MainLayout"
import PlayList from "../../components/PlayList/PlayList"
import { fetchPlays } from "../../store/actions/playAction"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"

export default function Repertoire() {
    // let [plays, setPlays] = useState([])
    const dispatch = useDispatch()

    useEffect(async () => {
        dispatch(fetchPlays())
    }, [])

    const plays = useSelector(state => state.play.plays)
    return (
    <>
        <MainLayout title="Репертуар">
            <PlayList plays={plays} />
        </MainLayout>
    </>
    )
}