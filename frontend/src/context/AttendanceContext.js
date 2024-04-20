
import { createContext, useReducer } from "react";

export const AttendancesContext = createContext();

export const attendancesReducer = (state, action) => {

    switch (action.type) {
        case 'SET_ATTENDANCE':
            return {
                attendances: action.payload
            }
        case 'CREATE_ATTENDANCE':

            return {
                attendances: [action.payload, ...state.attendances]
            }
        case 'UPDATE_ATTENDANCE':
            const updatedAttendance = action.payload;
            const updatedAttendances = state.attendances.map((attendance) => {
                if (attendance.time_out === updatedAttendance.time_out) {
                    return updatedAttendance
                }
                return attendance
            })
            return{ attendances: updatedAttendances }
            
        default:
            return state
    }
}

export const AttendancesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(attendancesReducer, {
        attendances: null,

    })
    //dispatch({type: 'CREATE_DEPARTMENT', payload: [{}, {}]})
    return (
        <AttendancesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AttendancesContext.Provider>
    )
}