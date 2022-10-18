import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    navbarIsHidden: true,
    isLoading: false
}

export const designReducer = createSlice({
    name: 'design',
    initialState,
    reducers: {
        setIsLoading(state, action) {
            state.isLoading = action.payload
        },
        toggleNavbar(state, action) {
            state.navbarIsHidden = !state.navbarIsHidden
        }
    },
})

/*
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
*/

//export default designReducer.reducer