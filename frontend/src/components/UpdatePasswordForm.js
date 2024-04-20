import { React, useState } from 'react'
import { useUpdatePassword } from '../hooks/useUpdatePassword';
const UpdatePasswordForm = ({ user }) => {
    const [new_password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [old_password, setOldPassword] = useState("");
    const { update, error, isLoading } = useUpdatePassword();
    const handleSubmit = async (evnt) => {
        evnt.preventDefault();
        await update(user.email, new_password, confirm_password, old_password,user);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Old Password</p>
                <input type='password' value={old_password} onChange={(evnt) => setOldPassword(evnt.target.value)} />
                <p>New Password</p>
                <input type='password' value={new_password} onChange={(evnt) => setPassword(evnt.target.value)} />
                <p>Confirm New Password</p>
                <input type='password' value={confirm_password} onChange={(evnt) => setConfirmPassword(evnt.target.value)} />
                <button disabled={isLoading} className="login-button">
                    <p className="test">UPDATE</p>
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}
export default UpdatePasswordForm
