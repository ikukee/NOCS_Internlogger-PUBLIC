import { createContext, useReducer, useEffect } from "react";

export const AdminAuthContext = createContext()
export const AdminAuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                adm: action.payload
            }
        case 'LOGOUT':
            return {
                adm: null
            }
        default:
            return state
    }
}
export const AdminAuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AdminAuthReducer, {
        adm: null
    })
    useEffect(()=>{
        const adm = JSON.parse(localStorage.getItem('adm'))
        if(adm){
            dispatch({type:'LOGIN', payload: adm})
        }
    }, [])
    return (
        <AdminAuthContext.Provider value = {{...state, dispatch}}>
            {children}
        </AdminAuthContext.Provider>
    )
}