import { MdAccessTime } from "react-icons/md";

import { useEffect, useState } from "react";
import { useAuthenticateContext } from "../hooks/useAuthenticateContext";
import { useAttendancesContext } from "../hooks/useAttendanceContext";

const AttendanceButtons = () => {
  const { user } = useAuthenticateContext();
  const { dispatch } = useAttendancesContext();
  const [error, setError] = useState(null);
  const [timeOutBtn, setTimeOutBtn] = useState()
  const [timeInBtn, setTimeInBtn] = useState()
  useEffect(() => {
    const getLatestAttendance = async () => {
      const response = await fetch(`${process.env.REACT_APP_LINK}/api/attendance`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      const json = await response.json()
      if (response.ok) {
        if (json[0]) {
          const first_timeOut = json[0].time_out
          const first_date = json[0].date
          const current_date = new Date().toLocaleDateString()
          // naka time in siya today
          if (first_timeOut === "-" && first_date === current_date) {
            setTimeOutBtn("blink-r")
          }
          // hindi naka time in kahapon
          if (first_timeOut !== "-" && first_date !== current_date) {
            setTimeInBtn("blink-g")
          }

          if (first_timeOut === "-" && first_date !== current_date) {
            setTimeInBtn("blink-g")
          }
        }
        if (!json[0]) {
          setTimeInBtn("blink-g")
        }
      }

    }
    if (user) {
      getLatestAttendance()
    }
  }, [user])
  const TimeInHandler = async (evnt) => {
    evnt.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const attendances = {};
    const response = await fetch(`${process.env.REACT_APP_LINK}/api/attendance/time-in`, {
      method: "POST",
      body: JSON.stringify(attendances),
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
      dispatch({ type: "CREATE_ATTENDANCE", payload: json });
      window.location.reload(false)
    }
  };
  const TimeOutHandler = async (evnt) => {
    evnt.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const attendances = {};
    const response = await fetch(`${process.env.REACT_APP_LINK}/api/attendance/time-out`, {
      method: "PATCH",
      body: JSON.stringify(attendances),
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
  const getUserId = async (id) => {
    
    const response = await fetch(
      `${process.env.REACT_APP_LINK}/api/account/${id}`,
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
      return json._id
    }
  };
  const PDFHandler = async (evnt) => {
    evnt.preventDefault();
    if (!user) {
      return;
    }
    let userId = await getUserId(user.email);
    await fetch(`${process.env.REACT_APP_LINK}/api/attendance/to-pdf/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/pdf'
      },
    }).then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `dtr.pdf`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };
  return (<>
    {user ?
      <div className="attendance_button_wrapper">
        <div className="time_in_wrapper">
          <button onClick={TimeInHandler} className={"btn-time-in " + timeInBtn}>
            <p className="timein_word">Time In</p>
            <MdAccessTime className="time_icon" />
          </button>
          <button onClick={TimeOutHandler} className={"btn-time-out " + timeOutBtn}>
            Time Out
            <MdAccessTime className="time_icon" />
          </button>
        </div>

        <button onClick={PDFHandler} className="btn-time-out dl_pdf">
          DOWNLOAD as PDF
        </button>
        <div className="error_code">
          {error && <div className="error">{error}</div>}
        </div>
      </div> : <><h3>Loading...</h3></>}</>
  );
};

export default AttendanceButtons;
