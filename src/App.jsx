import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ProfileUpdate from "./pages/ProfileUpdate";
import ErrorBoundary from "./components/ErrorBoundary";
import Logout from "./pages/Logout";
import LeaveHistory from "./pages/LeaveHistory";
import Approval from "./pages/Approval";
import LeaveRequestPage from "./pages/LeaveRequestPage";



export default function App() {
  return (
    <Routes>

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard/*" element={
           <PrivateRoute>
                 <Routes>
                   <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                  <Route path="leaverequests" element={<ErrorBoundary><LeaveRequestPage /></ErrorBoundary>} />
                   <Route path="profile-update" element={<ErrorBoundary><ProfileUpdate /></ErrorBoundary>} />
                  <Route path="logout" element={<ErrorBoundary><Logout /></ErrorBoundary>} />
                  <Route path="leave-history" element={<PrivateRoute><LeaveHistory/></PrivateRoute>} />
                  <Route path="leave-approval" element={<PrivateRoute><Approval/></PrivateRoute>} />
                 </Routes>
          </PrivateRoute>
           } />
   </Routes>
  );
}
