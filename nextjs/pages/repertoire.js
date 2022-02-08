import MainLayout from "../layouts/MainLayout/MainLayout"
import PlayList from "../components/PlayList/PlayList"
import { useState, useEffect } from "react/cjs/react.development"

export default function Repertoire() {
    let [plays, setPlays] = useState([])
    useEffect(() => {
        const fetchPlays = async () => {
            const response = await fetch('/fastapi/plays')
            const json_ = await response.json()
            setPlays(json_)
        }
        fetchPlays()
    }, [])
    

    return (
    <>
        <MainLayout title="Репертуар">
            <PlayList plays={plays} />
        </MainLayout>
    </>
    )
}