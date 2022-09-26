import { SET_IS_LOADING, TOGGLE_NAVBAR } from "../types"


const defaultState = {
    navbarIsHidden: true,
    isLoading: false,
    pagination: {
        active: 1,
        length: 0,
        perPage: 6,
    }
}

const designReducer = (state = defaultState, action) => {
    switch (action.type) {
        case TOGGLE_NAVBAR:
            return {...state, navbarIsHidden: !state.navbarIsHidden }
        case SET_IS_LOADING:
            return {...state, isLoading: action.value }
        default:
            return state
    }

}

export default designReducer