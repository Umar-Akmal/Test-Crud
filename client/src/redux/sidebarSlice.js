// Action Type
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

// Initial State
const initialState = {
    isSidebarOpen: false,
};

// Reducer
export const sidebarReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            return { ...state, isSidebarOpen: !state.isSidebarOpen };
        default:
            return state;
    }
};
