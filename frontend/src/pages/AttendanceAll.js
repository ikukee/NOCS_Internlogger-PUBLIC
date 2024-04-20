import { useEffect } from "react";
import { useAttendancesContext } from "../hooks/useAttendanceContext.js";
import { useAuthenticateContext } from "../hooks/useAuthenticateContext.js";
import AttendanceCard from "../components/AttendanceCard.js";
const Attendance = () => {
  const { attendances, dispatch } = useAttendancesContext();
  const { user } = useAuthenticateContext();
  useEffect(() => {
    const fetchAttendances = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_LINK}/api/attendance/get_all`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_ATTENDANCE", payload: json });
      }
    };

    if (user) {
      fetchAttendances();
    }
  }, [dispatch, user]);


  return (
    <div className="attendance-all-wrapper">
      <section className="attendance-all-header">
        <h1>All Attendances</h1>
        <p>List of all attendances sorted most recent to oldest.</p>
      </section>
      <table>
        <tr>
          <th>Date:</th>
          <th>Time-In:</th>
          <th>Time-Out:</th>
          <th>Hours Served:</th>
        </tr>
        <tbody>
          {attendances &&
            attendances.map((attendance) => (
              <AttendanceCard key={attendance._id} attendance={attendance} />
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default Attendance;
