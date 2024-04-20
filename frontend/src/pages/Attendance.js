import { useEffect, useState } from "react";
import { useAttendancesContext } from "../hooks/useAttendanceContext.js";
import { useAuthenticateContext } from "../hooks/useAuthenticateContext";
import AttendanceCard from "../components/AttendanceCard.js";
import AttendanceButtons from "../components/AttendanceButtons.js";
import { AttendanceTiles } from "../components/AttendanceTiles.js";
import { Link } from "react-router-dom";
import Clock from "../components/Clock.js";
const Attendance = () => {
  const [error, setError] = useState(null);
  const { attendances, dispatch } = useAttendancesContext();
  const { user } = useAuthenticateContext();
  const [requiredHours, setRequiredHours] = useState();
  const [user_name, user_setName] = useState();
  const [course, user_setCourse] = useState();
  useEffect(() => {
    const fetchAttendances = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_LINK}/api/attendance`,
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
    const getRequiredHours = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_LINK}/api/account/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();
      if (!response.ok) {
        console.log("error");
      }
      if (response.ok) {
        user_setCourse(json.course);
        if (json.hours_required > 0) {
          setRequiredHours(json.hours_required);
        } else {
          window.location.href = "/edit/required-hours";
        }
      }
    };
    const findUser = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_LINK}/api/account/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      }
      if (response.ok) {
        user_setName(json.name);
      }
    };
    if (user) {
      fetchAttendances();
      getRequiredHours();
      findUser();
    }
  }, [dispatch, user, requiredHours, user_name, course]);

  const getServedTime = () => {
    let totalMilliseconds = 0;
    let timeLogs = [];
    attendances &&
      attendances.map((attendance) =>
        timeLogs.push(`${attendance.time_in} - ${attendance.time_out}`)
      );
    for (let log of timeLogs) {
      let [timeIn, timeOut] = log.split(" - ");
      if (timeOut !== "-") {
        let timeInDate = new Date("01/01/2000 " + timeIn);
        let timeOutDate = new Date("01/01/2000 " + timeOut);
        let start_lunchBreak = new Date("01/01/2000 12:00 PM");
        let end_lunchBreak = new Date("01/01/2000 1:00 PM");
        if (timeInDate <= start_lunchBreak) {
          totalMilliseconds +=
            timeOutDate - end_lunchBreak - (timeInDate - start_lunchBreak);
        } else if (timeInDate > start_lunchBreak) {
          totalMilliseconds +=
            timeOutDate - end_lunchBreak - (timeInDate - end_lunchBreak);
        }
      }
    }
    let totalMinutes = totalMilliseconds / (1000 * 60);
    let totalHours = Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
    return {
      msg: `${totalHours} hours ${totalMinutes} minutes`,
      hours: totalHours,
      minutes: totalMinutes,
    };
  };
  const getPercentage = () => {
    let percentage =
      ((getServedTime().hours + getServedTime().minutes / 60) / requiredHours) *
      100;
    return percentage.toFixed(2);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <div className="attendance_wrapper">
      <div className="progress">
        <div className="progress_header">
          <div className="greetings_wrapper">
            <h2 className="welcome_greetings">Welcome, {user_name ? user_name : <>Loading...</>}!</h2>
            <p>{course}</p>
          </div>

          <div className="pfp_wrapper">
            <div className="time_wrapper">
              <Clock />
              {new Date().toLocaleDateString("en-EN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="details_wrapper">
          <h3>My Progress</h3>
          <div className="progress_samerow">
            <div className="progress_card">
              <p className="card_title">Total Hours Served:</p>
              <p>{requiredHours ? getServedTime().msg : <>Loading...</>}</p>
            </div>
            <div className="progress_card">
              <p className="card_title">Required Serve Hours:</p>
              <p>{requiredHours ? <>{requiredHours} hours </> : <>Loading...</>}</p>
            </div>
          </div>
          <div className="progress_card">
            <div className="remain_wrapper">
              <div className="remain_wrapper_1">
                <p className="card_title">Remaining Serve Hours:</p>
                <p>
                  {requiredHours ? <>{requiredHours - getServedTime().hours - 1} hours and {60 - getServedTime().minutes} minutes</> : <>Loading...</>}
                </p>
              </div>
              <div className="remain_wrapper_2">
                <p>{requiredHours ? <>{getPercentage()}%</>:<>Loading...</>}</p>
                <p>Completion</p>
              </div>
            </div>
          </div>

          <div className="action_buttons">
            <h3>Actions</h3>
            <AttendanceButtons />
          </div>
        </div>
      </div>
      <div className="main_dashboard">
        <h2 className="announcement_title">Calendar View</h2>
        <div className="grid-wrapper">
          {months.map(function (month, i) {
            return (
              <div className="grid-item">
                <p>{month}</p>

                <AttendanceTiles attendances={attendances} month={month} />
              </div>
            );
          })}
        </div>

        <div className="attendances_wrapper">
          <h2 className="announcement_title">Latest Attendances</h2>

          {attendances ?<table>
            <tr>
              <th>Date:</th>
              <th>Time-In:</th>
              <th>Time-Out:</th>
              <th>Hours Served:</th>
            </tr>
            <tbody>
              {attendances &&
                attendances.map((attendance) => (
                  <AttendanceCard
                    key={attendance._id}
                    attendance={attendance}
                  />
                ))}
            </tbody>
          </table>:<><h1>LOADING..</h1></>}
        </div>
        <div className="view_all_attendance_wrapper">
          <Link to="/attendance_all" className="btn_view_all">
            View All
          </Link>
        </div>
      </div>
      {error && (<div className="error">{error}</div>)}
    </div>
  );
};
export default Attendance;
