import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "../src/styles/nav.css";
import "../src/styles/login.css";
import "../src/styles/dashboard.css";
import "../src/styles/attendance-button.css";
import "../src/styles/attendance-all.css";
import "../src/styles/profile.css";
import "../src/styles/admin-panel.css"
import "../src/styles/set-hours-form.css"
import App from "./App";
import { AuthenticateContextProvider } from "./context/AuthenticateContext.js";
import { AttendancesContextProvider } from "./context/AttendanceContext.js";
import { AdminAuthContextProvider } from "./context/AdminAuthContext.js";
import { InternsContextProvider } from "./context/InternContext.js";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthenticateContextProvider>
      <AdminAuthContextProvider>
        <InternsContextProvider>
          <AttendancesContextProvider>
            <App />
          </AttendancesContextProvider>
        </InternsContextProvider>
      </AdminAuthContextProvider>
    </AuthenticateContextProvider>
  </React.StrictMode>
);
