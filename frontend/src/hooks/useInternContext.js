import { InternsContext } from "../context/InternContext.js"
import { useContext } from 'react'
const useInternContext = () =>{
    const context = useContext(InternsContext)
    if(!context){
        throw Error("useInternContext must be used inside a InternContextProvider")
    }
    return context
}
export default useInternContext