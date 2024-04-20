import { useState } from "react";
import { useAuthenticateContext } from "./useAuthenticateContext";

export const useSignup = () =>{
    const [error, setError] = useState(null)
    const [isLoading,setIsLoading] = useState(null)
    const {dispatch} = useAuthenticateContext()
    const signup = async (email, name, password,confirm_password, id_no, contact_no, course,school) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${process.env.REACT_APP_LINK}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, name, password,confirm_password, id_no, contact_no, course,school})
        })
        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            localStorage.setItem('user', JSON.stringify(json))

            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }

    }
    return {signup, isLoading, error}
}
