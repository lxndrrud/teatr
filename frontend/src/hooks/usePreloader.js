import { setIsLoading } from "../store/actions/designAction";

export function usePreloader(dispatch, action) {
    dispatch(setIsLoading(true))
        .then(dispatch(action))
        .then(() => {
            setTimeout(() => dispatch(setIsLoading(false)), 500)
        })
}