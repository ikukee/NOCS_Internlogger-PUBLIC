import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import LoginLogo from "../components/LoginLogo";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  
  const handleSubmit = async (evnt) => {
    evnt.preventDefault();
    await login(email, password);
  };
  return (
    <div className="login_wrapper">
      <LoginLogo />
      <div className="login_form_wrapper">
        <form className="login" onSubmit={handleSubmit}>
          <div className="form_header">
            <h2>Welcome to NAMES</h2>
            <p>Login using your account.</p>
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
          <di className="signup-button">
            <p>
              Don't have an account?{" "}
              <Link to="/Signup" className="signup">
                Signup
              </Link>
            </p>
          </di>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
