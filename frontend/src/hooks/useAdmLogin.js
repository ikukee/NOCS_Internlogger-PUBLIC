import { useState } from "react";
import { useAdminAuthContext } from "./useAdminAuthContext";

export const useAdmLogin = () =>{
    const [error, setError] = useState(null)
    const [isLoading,setIsLoading] = useState(null)
    const {dispatch} = useAdminAuthContext()
    const login = async (email, password) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${process.env.REACT_APP_LINK}/auth/adm/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password})
        })
        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            localStorage.setItem('adm', JSON.stringify(json))

            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }

    }
    return {login, isLoading, error}
}
