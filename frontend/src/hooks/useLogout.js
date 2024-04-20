import { useAuthenticateContext } from "./useAuthenticateContext"
export const useLogout = () =>{
    const {dispatch} =useAuthenticateContext()
    const logout = () =>{
        localStorage.removeItem('user')
        dispatch({type:"LOGOUT"})
        localStorage.removeItem('adm')
        dispatch({type:"LOGOUT"})
        window.location.reload()
    }
    return {logout}
}