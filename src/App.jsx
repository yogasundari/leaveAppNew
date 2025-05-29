import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./components/DashboardLayout"; // New Layout component
import Dashboard from "./pages/Dashboard";
import ProfileUpdate from "./pages/ProfileUpdate";
import ErrorBoundary from "./components/ErrorBoundary";
import Logout from "./pages/Logout";
import LeaveHistory from "./pages/LeaveHistory";
import Approval from "./pages/Approval";
import LeaveRequestPage from "./pages/LeaveRequestPage";
import AlterationPage from "./pages/AlterationPage";
import NotificationPage from "./pages/NotificationPage";
import AdminPanel from "./pages/AdminPanel";


export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/alteration" element={<ErrorBoundary><AlterationPage /></ErrorBoundary>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Private routes for dashboard */}
<Route
  path="/dashboard"
  element={
    <PrivateRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
      <DashboardLayout />
    </PrivateRoute>
  }
>
        {/* Nested routes inside dashboard layout */}
        <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="leaverequests" element={<ErrorBoundary><LeaveRequestPage /></ErrorBoundary>} />
        <Route path="profile-update" element={<ErrorBoundary><ProfileUpdate /></ErrorBoundary>} />
        <Route path="logout" element={<ErrorBoundary><Logout /></ErrorBoundary>} />
        <Route path="leave-history" element={<PrivateRoute><LeaveHistory /></PrivateRoute>} />
        <Route path="leave-approval" element={<PrivateRoute><Approval /></PrivateRoute>} />
        <Route path="notifications" element={<ErrorBoundary><NotificationPage /></ErrorBoundary>} />
      </Route>
      <Route
  path="/admin-panel"
  element={
    <PrivateRoute allowedRoles={["ADMIN"]}>
      <AdminPanel/>
    </PrivateRoute>
  }
></Route>
    </Routes>
  );
}
