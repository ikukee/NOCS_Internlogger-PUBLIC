import React, { useEffect, useState } from 'react'
import { useAdminAuthContext } from '../hooks/useAdminAuthContext';
import { useAttendancesContext } from '../hooks/useAttendanceContext';
import AttendanceCard from '../components/adm_AttendanceCard';
import { Link, useParams } from 'react-router-dom';
export const InternAccount = (key) => {
    const { attendances, dispatch } = useAttendancesContext();
    const { adm } = useAdminAuthContext();
    const { id } = useParams();
    const [userAccount, set_userAccount] = useState()
    const [userId, set_usetId] = useState();
    const [requiredHours, setRequiredHours] = useState();
    const [error, setError] = useState();
    const [displayForm, setDisplayForm] = useState(false);
    const [TimeIn, setTimeIn] = useState();
    const [TimeOut, setTimeOut] = useState("-");
    const [date, setDate] = useState();
    useEffect(() => {
        const findUser = async () => {
            console.log(id)
            const response = await fetch(
                `${process.env.REACT_APP_LINK}/db/account/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${adm.token}`,
                    },
                }
            );
            const json = await response.json();
            if (response.ok) {
                const {name, _id, hours_required } = json;
                set_userAccount(name)
                set_usetId(_id)
                if (hours_required > 0) {
                    setRequiredHours(hours_required);
                } else {
                    setRequiredHours(0);
                }
            } else {
                setError("Error: Please Try Again Later.")
            }
        };
        const fetchAttendances = async () => {
            const response = await fetch(
                `${process.env.REACT_APP_LINK}/db/attendances/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${adm.token}`,
                    },
                }
            );
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: "SET_ATTENDANCE", payload: json });
            }
        };
        if (adm) {
            fetchAttendances();
            findUser();
        }
    }, [dispatch, adm, id, requiredHours, userAccount]);
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
    const PDFHandler = async (evnt) => {
        evnt.preventDefault();
        if (!userId) {
            return;
        }
        await fetch(`${process.env.REACT_APP_LINK}/db/to-pdf/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${adm.token}`,
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
    const CreateRecord = async (evnt) => {
        evnt.preventDefault();       
        if(!adm){
            setError("You must be logged in, try to login again");
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_LINK}/db/attendances/add/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${adm.token}`},
            body: JSON.stringify({TimeIn,TimeOut,date})
        })
        const json = await response.json()

        if(!response.ok){
            
            setError(json.error)
        }
        if(response.ok){
            window.location.reload(false);
        }
    }
    return (<>
        <Link to="/control">BACK</Link>

        <div className="attendance-all-wrapper">
            <div class="account-panel">
                <h1>{userAccount}</h1>
                <div>
                    {requiredHours > 0 ? <>
                        <div>
                            <h2>REQUIRED HOURS: </h2>
                            <h2>{requiredHours} Hours</h2>
                        </div>
                        <div>
                            <h2>TOTAL SERVED TIME:</h2>
                            <h2>{getServedTime().msg}</h2>
                        </div>
                        <div>
                            <h2>REMAINING HOURS:</h2>
                            <h2>{requiredHours - getServedTime().hours - 1} hours and{" "}
                                {60 - getServedTime().minutes} minutes</h2>
                        </div>
                    </> : <>
                        <h1 style={{ color: "red" }}>REQUIRED HOURS IS NOT SET!</h1>
                    </>}

                </div>
                <div>
                    <button onClick={PDFHandler} className="btn-time-out dl_pdf">
                        DOWNLOAD as PDF
                    </button>
                    {displayForm ? <></> : <button onClick={() => { setDisplayForm(!displayForm) }} className={displayForm ? "btn-time-in dl_pdf blink-r" : "btn-time-in dl_pdf blink-g"}>
                        Open Record Form
                    </button>}
                </div>

            </div>
            {displayForm ? <>

                <div className='display-form'>

                    <div><p>DATE: </p><input type="date" onChange={(evnt) => setDate(evnt.target.value)} /></div>
                    <div><p>TIME IN</p><input type="time" onChange={(evnt) => setTimeIn(evnt.target.value)} /></div>
                    <div><p>TIME OUT</p><input type="time" onChange={(evnt) => setTimeOut(evnt.target.value)} /></div>

                    <div>
                        <button onClick={CreateRecord} className='btn-time-in dl_pdf blink-g'>ADD Record</button>
                        <button onClick={() => { setDisplayForm(!displayForm) }} className={displayForm ? "btn-time-in dl_pdf blink-r" : "btn-time-in dl_pdf blink-g"}>Close</button>
                    </div>
                </div>
            </> : <></>}
            <section className="attendance-all-header">

                <h1>All Attendances</h1>
                <p>List of all attendances sorted most recent to oldest.</p>

                <div className="error_code">
                    {error && <div className="error">{error}</div>}
                </div>
            </section>
            <table>
                <tr>
                    <th>Date:</th>
                    <th>Time-In:</th>
                    <th>Time-Out:</th>
                    <th>Hours Served:</th>
                    <th>ACTIONS:</th>
                </tr>
                <tbody>
                    {attendances &&
                        attendances.map((attendance) => (
                            <AttendanceCard key={attendance._id} attendance={attendance} />

                        ))}
                </tbody>
            </table>
        </div >
    </>)
}
