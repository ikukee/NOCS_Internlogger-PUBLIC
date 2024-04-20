import { useState, useEffect } from "react";
import { useAdminAuthContext } from "../hooks/useAdminAuthContext";
import { useAttendancesContext } from "../hooks/useAttendanceContext";
const AttendanceCard = ({ attendance }) => {
  const { adm } = useAdminAuthContext();
  const { dispatch } = useAttendancesContext();
  const [error, setError] = useState(null);
  const [hoursServed, setHoursServed] = useState();
  const [showForm, setshowForm] = useState(false);
  const [newTimeIn, setNewTimeIn] = useState();
  const [newTimeOut, setNewTimeOut] = useState();
  const [newDate, setNewDate] = useState(attendance.date);


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
  },[]);
  const forceTimeout = async (evnt) => {
    if (!adm) {
      setError("You must be logged in");
      return;
    }
    const valPass = { current_id_doc: attendance._id };
    const response = await fetch(`${process.env.REACT_APP_LINK}/db/attendances/force`, {
      method: "PATCH",
      body: JSON.stringify(valPass),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adm.token}`,
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
  const editTime = async (evnt) => {
    evnt.preventDefault();
    console.log(newDate + " >< " + newTimeIn + " >< " + newTimeOut)
    if (!newDate || !newTimeIn || !newTimeOut) {
      setError("Please fill all field.")
    } else {
      const valPass = { current_id_doc: attendance._id, newTimeIn: newTimeIn, newDate: newDate, newTimeOut:newTimeOut };
      const response = await fetch(`${process.env.REACT_APP_LINK}/db/attendances/edit`, {
        method: "PATCH",
        body: JSON.stringify(valPass),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adm.token}`,
        },
      });
      await response.json();
      window.location.reload(false)
    }
    //
  }
  const deleteTime = async(e) =>{
    const response = await fetch(`${process.env.REACT_APP_LINK}/db/attendances/delete/${e}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adm.token}`,
      },
    });
    if(response.ok){
      setError("Successfully deleted a record.")
      window.location.reload(false);
    }else{
      setError("Not GOOD")
    }
  }
  const displayForm = async (evnt) => {
    setshowForm(!showForm)
  }
  return (<>
    {error && (<><div className="error">{error}</div></>)}
    <table>
      <tr>
      </tr>
      <tbody>
        <tr>
          <td>{attendance.date}</td>
          <td>{attendance.time_in}</td>
          <td>
            {attendance.time_out}
          </td>
          <td>{hoursServed} hours</td>
          <td>
            <button class="btn-edit" onClick={displayForm}>{showForm ? (<></>) : (<>Edit</>)}</button>

            {attendance.time_out === "-" && attendance.date !== getTime(false) ?
              <>{<button class="btn-edit" onClick={() => { if (window.confirm('Proceed?')) { forceTimeout() } }}>
                Timeout
              </button>}</> : <></>}
              <button class="btn-edit" onClick={() => { if (window.confirm('Would you like to delete this?')) { deleteTime(attendance._id) } }}>
                Delete
              </button>
          </td>

        </tr>
        {showForm && (<>
          <tr>
            <td><input type="date" placeholder={newDate} onChange={(evnt) => setNewDate(evnt.target.value)} /></td>
            <td><input type="time" onChange={(evnt) => setNewTimeIn(evnt.target.value)} /></td>
            <td><input type="time" onChange={(evnt) => setNewTimeOut(evnt.target.value)} /></td>
            <td>-</td>
            <td><button onClick={editTime}>UPDATE</button></td>
          </tr></>
        )}
      </tbody>
    </table></>
  );
};

export default AttendanceCard;
