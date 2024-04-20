import { AttendancesContext } from "../context/AttendanceContext.js"
import { useContext } from 'react'
export const useAttendancesContext = () =>{
    const context = useContext(AttendancesContext)
    if(!context){
        throw Error("UseAttendancesCotext must be used inside a AttendanceContextProvider")
    }
    return context
}