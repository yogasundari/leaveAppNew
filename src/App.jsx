import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProfileUpdate from "./pages/ProfileUpdate";
import ErrorBoundary from "./components/ErrorBoundary";
import Logout from "./pages/Logout";
import LeaveHistory from "./pages/LeaveHistory";
import Approval from "./pages/Approval";
import LeaveRequestPage from "./pages/LeaveRequestPage";
import AlterationPage from "./pages/AlterationPage";
import NotificationPage from "./pages/NotificationPage";
import AdminPanel from "./pages/admin/AdminPanel";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import AdminLayout from "./components/AdminLayout";
import EditEmployee from "./pages/admin/EditEmployee";
import Home from "./pages/Home";
import LeaveTypeManagement from "./pages/admin/LeaveTypeManagement";
import EditLeaveType from "./pages/admin/EditLeaveType";
import AddLeaveType from "./pages/admin/AddLeaveType";
import EditDepartment from "./pages/admin/waste";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import AddDepartment from "./pages/admin/AddDepartment";
import ApprovalFlowManagement from "./pages/admin/ApprovalFlowManagement";
import EditApprovalFlow from "./pages/admin/EditApprovalFlow";
import AddApprovalFlow from "./pages/admin/AddApprovalFlow";
import ApprovalFlowLevelManagement from "./pages/admin/ApprovalFlowLevelManagement";
import EditApprovalFlowLevel from "./pages/admin/EditApprovalFlowLevel";
import AddApprovalFlowLevel from "./pages/admin/AddApprovalFlowLevel";

// Main App Component
export default function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public Routes */}
      <Route
        path="/alteration"
        element={
          <ErrorBoundary>
            <AlterationPage />
          </ErrorBoundary>
        }
      />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          }
        />
        <Route
          path="profile-update"
          element={
            <ErrorBoundary>
              <ProfileUpdate />
            </ErrorBoundary>
          }
        />
        <Route
          path="logout"
          element={
            <ErrorBoundary>
              <Logout />
            </ErrorBoundary>
          }
        />
        <Route
          path="leaverequests"
          element={
            <ErrorBoundary>
              <LeaveRequestPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="leave-history"
          element={
            <PrivateRoute>
              <LeaveHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="leave-approval"
          element={
            <PrivateRoute>
              <Approval />
            </PrivateRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ErrorBoundary>
              <NotificationPage />
            </ErrorBoundary>
          }
        />
      </Route>

      {/* Admin Panel Routes */}
      <Route
        path="/admin-panel"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={
            <ErrorBoundary>
              <AdminPanel />
            </ErrorBoundary>
          }
        />
        <Route
          path="employee"
          element={
            <ErrorBoundary>
              <EmployeeManagement />
            </ErrorBoundary>
          }
        />
        <Route path="employee/edit/:id" element={<EditEmployee />} />
        <Route
          path="leave-type"
          element={
            <ErrorBoundary>
              <LeaveTypeManagement />
            </ErrorBoundary>
          }
        />
        <Route path="leave-type/edit/:id" element={<EditLeaveType />}/>
        <Route path="leave-type/add"element={<ErrorBoundary><AddLeaveType /></ErrorBoundary>} />
        <Route path="department" element={<ErrorBoundary> <DepartmentManagement /></ErrorBoundary>}/>
        <Route path="department/edit/:id" element={<ErrorBoundary> <EditDepartment /></ErrorBoundary>} />
        <Route path="department/add" element={<ErrorBoundary> <AddDepartment /></ErrorBoundary>} />
        <Route path="approvalflow" element={<ErrorBoundary> <ApprovalFlowManagement /> </ErrorBoundary>} />
        <Route path="approvalflow/edit/:id" element={<ErrorBoundary> <EditApprovalFlow /> </ErrorBoundary>} />
        <Route path="approvalflow/add" element={<ErrorBoundary> <AddApprovalFlow /> </ErrorBoundary>} />
        <Route path="approvalflowlevel" element={<ErrorBoundary> <ApprovalFlowLevelManagement /> </ErrorBoundary>} />
        <Route path="approvalflowlevel/edit/:id" element={<ErrorBoundary> <EditApprovalFlowLevel /> </ErrorBoundary>} />
        <Route path="approvalflowlevel/add" element={<ErrorBoundary> <AddApprovalFlowLevel /> </ErrorBoundary>} />
      </Route>
    </Routes>
  );
}
