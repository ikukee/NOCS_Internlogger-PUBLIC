import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthenticateContext } from "./hooks/useAuthenticateContext";
// pages & components

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Navbar from './components/Navbar';
import Attendance from './pages/Attendance'
import AttendanceAll from "./pages/AttendanceAll";
import { Profile } from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminConsole } from "./pages/AdminConsole";
import { InternAccount } from "./pages/InternAccount";
import { useAdminAuthContext } from "./hooks/useAdminAuthContext";
import { SetHoursRequired } from "./pages/SetHoursRequired";
import { AdminProfile } from "./pages/AdminCred";
function App() {

  const { user } = useAuthenticateContext();
  const { adm } = useAdminAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar></Navbar>
        <div class="pages">
          
          <Routes>
            <Route
              path="/"
              element={user ? <Attendance /> : <Login />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to="/" />}
            />
            <Route
              path="/reset-password/:id/:token"
              element={!user ? <ResetPassword /> : <Navigate to="/" />}
            />
            <Route
              path="/attendance_all"
              element={user ? <AttendanceAll /> : <Login />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Login />}
            />
            <Route
              path="/account/hours_required/set" element={user ? <SetHoursRequired /> : <Login />}
            />
            <Route path="/control" />
            <Route path="*" element={!adm && <><h1 style={{ color: 'red', margin: 'auto', fontSize: '8rem' }}>You Got Lost!</h1></>} />
          </Routes>
          {adm ?
            <Routes>
              
              <Route
                path="/control"
                element={adm ? <AdminConsole /> : <AdminLogin />}
              />

              <Route
                path="/control/account/:id"
                element={adm ? <InternAccount /> : <AdminLogin />}
              />
              <Route
                path="/control/profile"
                element={adm ? <AdminProfile /> : <AdminLogin />} />
              <Route path="*" element={<Navigate to={"/control"}/>} />
            </Routes>
            :
            <Routes>
              <Route
              path="/control" element={user ? <Navigate to="/"/>:<AdminLogin/>}
            />
            </Routes>
          }
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
