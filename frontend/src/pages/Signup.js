import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [confirm_password, setConfirmPassword] = useState('')
  const [name, setName] = useState("");
  const [id_no, setIdNumber] = useState("");
  const [contact_no, setContactNumber] = useState("");
  const [course, setCourse] = useState("");
  const [school, setSchool] = useState("");
  const { signup, error, isLoading } = useSignup();
  const handleSubmit = async (evnt) => {
    evnt.preventDefault();
    await signup(email, name, password,confirm_password, id_no, contact_no, course, school);
  };
  return (
    <div className="signup_wrapper">
      <div className="signup_form_wrapper">

        <form className="signup" onSubmit={handleSubmit}>
          <div className="form_header">
            <h2>Sign Up</h2>
            <p>Create an account for free.</p>
          </div>

          <label>Primary Details:</label>
          <div className="same_row">
            <input
              placeholder="Name"
              type="text"
              onChange={(evnt) => setName(evnt.target.value)}
              value={name}
            />
            <input
              placeholder="Email"
              type="email"
              onChange={(evnt) => setEmail(evnt.target.value)}
              value={email}
            />
            <input
              placeholder="ID Number eg. 201810640"
              type="text"
              onChange={(evnt) => setIdNumber(evnt.target.value)}
              value={id_no}
            />
          </div>

          <label>Security:</label>
          <div className="same_row">
            <input
              placeholder="Password"
              type="password"
              onChange={(evnt) => setPassword(evnt.target.value)}
              value={password}

            />
            <input
              type="password"
              placeholder="Repeat Password"
               onChange={(evnt) => setConfirmPassword(evnt.target.value)}
              value={confirm_password}
            />
          </div>
          <label>Other Details:</label>
          <div className="same_row">
            <input
              placeholder="Contact Number"
              type="text"
              onChange={(evnt) => setContactNumber(evnt.target.value)}
              value={contact_no}
            />

          </div>
          <label>Educational Information: </label>
          <div className="same_row">
            <select
              className="select_course"
              onChange={(evnt) => setCourse(evnt.target.value)}
              value={course}
            >
              <option>Select Course:</option>
              <option>BS Information Technology</option>
              <option>BS Computer Science</option>
              <option>BS Computer Engineering</option>
              <option>SHS</option>
              <option>OTHERS</option>
            </select>

            <input
              placeholder="School"
              type="text"
              onChange={(evnt) => setSchool(evnt.target.value)}
              value={school}
            />
          </div>

          <button disabled={isLoading}>SIGNUP</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
