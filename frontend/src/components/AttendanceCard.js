import { useState, useEffect } from "react";
import { useAuthenticateContext } from "../hooks/useAuthenticateContext";
import { useAttendancesContext } from "../hooks/useAttendanceContext";
const AttendanceCard = ({ attendance }) => {
  const { user } = useAuthenticateContext();
  const { dispatch } = useAttendancesContext();
  const [error, setError] = useState(null);
  const [hoursServed, setHoursServed] = useState();
  const getTime = (x) => {
    var date_ob = new Date();
    if (!x) {
      return date_ob.toLocaleDateString();
    } else {
      return date_ob.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };
  useEffect(() => {
    const getHours = () => {
      if (attendance.time_out === "-") {
        setHoursServed(0)
        return
      }
      let timeIn = new Date("01/01/2000 " + attendance.time_in);
      let start_lunchBreak = new Date("01/01/2000 12:00 PM")
      let end_lunchBreak = new Date("01/01/2000 1:00 PM")
      let timeOut = new Date("01/01/2000 " + attendance.time_out);

      if (timeIn <= start_lunchBreak) {
        let totalMinutes = ((timeOut - end_lunchBreak) - (timeIn - start_lunchBreak)) / (1000 * 60);
        let totalHours = totalMinutes / 60;
        setHoursServed(totalHours.toFixed(2))
      }
      if (timeIn > start_lunchBreak) {
        let totalMinutes = ((timeOut - end_lunchBreak) - (timeIn - end_lunchBreak)) / (1000 * 60);
        let totalHours = totalMinutes / 60;
        setHoursServed(totalHours.toFixed(2))
      }
    };
    return getHours();
  });
  const forceTimeout = async (evnt) => {
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const valPass = { current_id_doc: attendance._id };
    const response = await fetch(`${process.env.REACT_APP_LINK}/api/attendance/force`, {
      method: "PATCH",
      body: JSON.stringify(valPass),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      dispatch({ type: "UPDATE_ATTENDANCE", payload: json });
      window.location.reload(false);
    }
  };
  return (
    <table>
      <tbody>
        <tr>
          <td>{attendance.date}</td>
          <td>{attendance.time_in}</td>
          <td>
            {attendance.time_out} 
            {attendance.time_out === "-" && attendance.date !== getTime(false) ? 
            <>{<button class="btn-edit" onClick={() => {if(window.confirm('Proceed?')){forceTimeout()}}}>
              Timeout
            </button>}</>:<></>}
            {error && (<div className="error">{error}</div>)}
          </td>
          <td>{hoursServed} hours</td>

        </tr>
      </tbody>
    </table>
  );
};

export default AttendanceCard;
