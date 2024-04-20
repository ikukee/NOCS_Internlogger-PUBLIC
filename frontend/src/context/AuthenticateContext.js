import { createContext, useReducer, useEffect } from "react";

export const AuthenticateContext = createContext()
export const authenticateReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.payload
            }
        case 'LOGOUT':
            return {
                user: null
            }
        default:
            return state
    }
}
export const AuthenticateContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authenticateReducer, {
        user: null
    })
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'))
        if(user){
            dispatch({type:'LOGIN', payload: user})
        }
    }, [])
    return (
        <AuthenticateContext.Provider value = {{...state, dispatch}}>
            {children}
        </AuthenticateContext.Provider>
    )
}