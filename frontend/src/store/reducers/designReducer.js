import { TOGGLE_NAVBAR } from "../types"


const defaultState = {
    navbarIsHidden: true,
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
        
        default:
            return state
    }

}

export default designReducer