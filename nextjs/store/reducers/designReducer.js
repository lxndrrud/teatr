import { TOGGLE_NAVBAR } from "../types"


const defaultState = {
    navbarIsHidden: true,
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