import { useState } from "react";
import { useParams } from "react-router-dom";
const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const {id, token} = useParams()
    const handleSubmit = async(evnt) =>{
        evnt.preventDefault()
        const response = await fetch(`${process.env.REACT_APP_LINK}/auth/reset-password/${id}/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({password})
        })
        const json = await response.json()
        
        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            setIsLoading(false)
        }
    }
    return (<>
        <div className="signup_wrapper">
            <div className="signup_form_wrapper">
                <form className="signup" onSubmit={handleSubmit}>
                    <div className="form_header">
                        <h2>Reset Password</h2>
                        
                    </div>
                    <label>New Password:</label>
                    <div className="same_row">

                        <input
                            placeholder="Password"
                            type="password"
                            onChange={(evnt) => setPassword(evnt.target.value)}
                            value={password}
                        />

                    </div>
                    <button disabled={isLoading}>Update</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>


    </>)
}
export default ResetPassword