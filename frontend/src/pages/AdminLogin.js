import React from 'react'
import LoginLogo from '../components/LoginLogo'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAdmLogin } from '../hooks/useAdmLogin'
export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAdmLogin();
  const handleSubmit = async (evnt) => {
    evnt.preventDefault();
    await login(email, password);
  };
  return (<>
    <div className="login_wrapper">
      
      <div className="login_form_wrapper">
        <form className="adm_login" onSubmit={handleSubmit}>
        
          <div className="form_header">
            <h2>ADMIN LOGIN</h2>
            <p>Login using admin account.</p>
          </div>
          <label>EMAIL/ID:</label>
          <input
            type="text"
            onChange={(evnt) => setEmail(evnt.target.value)}
            value={email}
            placeholder="Email Address"
          />
          <label>Password:</label>
          <input
            type="password"
            onChange={(evnt) => setPassword(evnt.target.value)}
            value={password}
            placeholder="Enter your password"
          />
          <button disabled={isLoading} className="login-button">
            <p className="test">LOGIN</p>
          </button>
          {error && <div className="error">{error}</div>}
          <Link to="/forgot-password" className="signup">
            Forgot Password
          </Link>
          
        </form>
      </div>
    </div>
  </>)
}
