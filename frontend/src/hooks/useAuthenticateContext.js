import { AuthenticateContext } from '../context/AuthenticateContext'
import { useContext } from 'react'
export const useAuthenticateContext = () =>{
    const context = useContext(AuthenticateContext)
    if(!context){
        throw Error("UseAuthenticateContext must be used inside a AuthenticateCOntextProvider")
    }
    return context
}