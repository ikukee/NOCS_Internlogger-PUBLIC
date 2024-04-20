import { useState } from "react";
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const handleSubmit = async(evnt) =>{
        evnt.preventDefault()
        const response = await fetch(`${process.env.REACT_APP_LINK}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email})
        })
        const json = await response.json()
        
        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            

            setError("SUC")
            setIsLoading(false)
        }
    }
    return (<>
        <div className="signup_wrapper">
            <div className="signup_form_wrapper">
                <form className="signup" onSubmit={handleSubmit}>
                    <div className="form_header">
                        <h2>Forgot Password</h2>
                        <p>Fill in your account email.</p>
                    </div>
                    <label>Primary Details:</label>
                    <div className="same_row">

                        <input
                            placeholder="Email"
                            type="email"
                            onChange={(evnt) => setEmail(evnt.target.value)}
                            value={email}
                        />

                    </div>
                    <button disabled={isLoading}>SEND</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>


    </>)
}
export default ForgotPassword