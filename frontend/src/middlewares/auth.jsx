import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export function LoginRoute({ children }) {
    const token = useSelector(state => state.user.token)
    if (!(token && token.length > 0)) {
        return <Navigate to={'/login'} />
    }
    return children
}

export function AdminRoute({ children }) {
    const token = useSelector(state => state.user.token)
    const isAdmin = useSelector(state => state.user.isAdmin)
    if (!(token && token.length > 0 && isAdmin)) {
        return <Navigate to={'/'} />
    }
    return children
}