import { AdminAuthContext } from "../context/AdminAuthContext"
import { useContext } from 'react'
export const useAdminAuthContext = () =>{
    const context = useContext(AdminAuthContext)
    if(!context){
        throw Error("UseAdminAuthContext must be used inside a AuthAdminContextProvider")
    }
    return context
}