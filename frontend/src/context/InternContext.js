
import { createContext, useReducer } from "react";

export const InternsContext = createContext();

export const internsReducer = (state, action) => {

    switch (action.type) {
        case 'SET_INTERN':
            return {
                interns: action.payload
            }
        case 'CREATE_INTERN':

            return {
                interns: [action.payload, ...state.interns]
            }
            
        default:
            return state
    }
}

export const InternsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(internsReducer, {
        interns: null,

    })
    //dispatch({type: 'CREATE_DEPARTMENT', payload: [{}, {}]})
    return (
        <InternsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </InternsContext.Provider>
    )
}