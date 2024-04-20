import { useState } from "react";
export const useUpdatePassword = () =>{
    const [error, setError] = useState(null)
    const [isLoading,setIsLoading] = useState(null)
    
    const update = async (email, new_password, confirm_password,old_password,user) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${process.env.REACT_APP_LINK}/api/account/password/update`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify({email, new_password,confirm_password,old_password})
        })
        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            setIsLoading(false)
        }

    }
    return {update, isLoading, error}
}
