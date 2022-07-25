import { useStore } from "react-redux"
import { Navigate } from "react-router-dom"

export function LoginRoute({ children }) {
    const store = useStore()
    const token = store.getState().user.token
    if (!(token && token.length > 0)) {
        return <Navigate to={'/'} />
    }
    return children
}