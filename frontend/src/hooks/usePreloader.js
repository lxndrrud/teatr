//import { setIsLoading } from "../store/actions/designAction";
import { designReducer } from "../store/reducers/designReducer"
import { useDispatch } from 'react-redux'

export function usePreloader(dispatch, action) {
    const { setIsLoading } = designReducer.actions
    //const dispatch = useDispatch()

    dispatch(setIsLoading(true))
    dispatch(action)
        
    setTimeout(() => dispatch(setIsLoading(false)), 500)
}