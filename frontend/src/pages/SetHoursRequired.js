import React, { useState, useEffect } from 'react'
import { useAuthenticateContext } from '../hooks/useAuthenticateContext';
export const SetHoursRequired = () => {
    const { user } = useAuthenticateContext();
    const [hours, setHours] = useState(0);
    const [error, setError] = useState(null);
    const [userID, setUserID] = useState();
    useEffect(() => {
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
                setUserID(json._id);
            }
        };

        if (user) {
            findUser();
        }
    }, [user, userID])

    const clickSubmit = async (evnt) => {
        evnt.preventDefault()
        if (!userID) setError("There was an error please refresh.");
        if (hours > 0) {

            const response = await fetch(`${process.env.REACT_APP_LINK}/api/account/hours_required/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ hours, userID })
            });
            const json = await response.json();

            if (!response.ok) {
                setError("There was an error please refresh.")
            }
            if (response.ok) {
                window.location.href = "/";
            }
        } else {
            setError("The value must be greater than 0")
        }

    }

    return (<>
        <div class="set_hours_wrapper">
            <div class="set_hours_form">
                <div class="form_content">
                    <h2>SET REQUIRED HOURS</h2>
                    <p>Set the required hours given by your SP Coordinator</p>
                    <div class="row">
                        <div class="col">
                            <p>Hours Required:</p>
                        </div>
                        <div class="col">
                            <input type="number" onChange={(e) => {
                                setHours(e.target.value)
                            }} />
                        </div>
                    </div>

                    <button onClick={clickSubmit}>SUBMIT</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </div>
        </div>
    </>)
}
