import { React, useState } from 'react'
const UpdateAdminPasswordForm = ({ user, account}) => {
    const [new_password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [old_password, setOldPassword] = useState("");
    const [error, setError] = useState(); 
    const [success,setSuccess] = useState();
    const handleSubmit = async (evnt) => {
        evnt.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_LINK}/db/admin/update/${account._id}`, {
            method: "PATCH",
            body: JSON.stringify({new_password:new_password, confirm_password:confirm_password, old_password:old_password}),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });
        let json = await response.json();
        if(!response.ok){
            setError(json.error)
        }
        if(response.ok){
            setSuccess("SUCCESSFULLY CHANGED PASSWORD")
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Old Password</p>
                <input type='password' onChange={(evnt) => setOldPassword(evnt.target.value)} />
                <p>New Password</p>
                <input type='password' onChange={(evnt) => setPassword(evnt.target.value)} />
                <p>Confirm New Password</p>
                <input type='password' onChange={(evnt) => setConfirmPassword(evnt.target.value)} />
                <button className="login-button">
                    <p className="test">UPDATE</p>
                </button>
                {error && <p color='red'>{error}</p>}
                {success && <p color='green'>{success}</p>}
            </form>
        </div>
    )
}
export default UpdateAdminPasswordForm
