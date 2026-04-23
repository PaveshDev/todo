import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

import Navbar from "./modules/shared/components/Navbar";
import PatientFeedback from "./modules/patient/pages/PatientFeedback";
import EditPatientFeedback from "./modules/patient/pages/EditPatientFeedback";
import AdminFeedbackInbox from "./modules/admin/pages/AdminFeedbackInbox";
import AdminConsultations from "./modules/admin/pages/AdminConsultations";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import DoctorFeedbackView from "./modules/doctor/pages/DoctorFeedbackView";
import DoctorSummary from "./pages/DoctorSummary";
import Consultations from "./pages/Consultations";
import Login from "./pages/Login";

const getHomeByRole = (role) => (role === "admin" ? "/admin/dashboard" : "/");

// Protected Route Component
function ProtectedRoute({ element, allowedRoles }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={getHomeByRole(userRole)} replace />;
  }

  return element;
}

function AppLayout() {
  const location = useLocation();
  const patientDashboardPaths = ["/", "/patient/feedback", "/submit", "/consultations"];
  const adminDashboardPaths = ["/admin/dashboard", "/admin/feedback", "/admin/consultations"];
  const isPatientDashboardRoute = patientDashboardPaths.includes(location.pathname);
  const isAdminDashboardRoute = adminDashboardPaths.includes(location.pathname);
  const isLoginRoute = location.pathname === "/login";

  return (
    <div className="app">
      {!isPatientDashboardRoute && !isAdminDashboardRoute && !isLoginRoute && <Navbar />}
      <main className={`main-content ${isPatientDashboardRoute || isAdminDashboardRoute ? "patient-shell-main" : ""}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<PatientFeedback />} allowedRoles={["patient"]} />} />
          <Route path="/patient/feedback" element={<ProtectedRoute element={<PatientFeedback />} allowedRoles={["patient"]} />} />
          <Route path="/consultations" element={<ProtectedRoute element={<Consultations />} allowedRoles={["patient"]} />} />
          <Route path="/submit" element={<ProtectedRoute element={<PatientFeedback />} allowedRoles={["patient"]} />} />
          <Route path="/edit/:id" element={<ProtectedRoute element={<EditPatientFeedback />} allowedRoles={["patient"]} />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
          <Route path="/admin/feedback" element={<ProtectedRoute element={<AdminFeedbackInbox />} allowedRoles={["admin"]} />} />
          <Route path="/admin/consultations" element={<ProtectedRoute element={<AdminConsultations />} allowedRoles={["admin"]} />} />

          <Route path="/doctor/feedback" element={<ProtectedRoute element={<DoctorFeedbackView />} />} />
          <Route path="/summary" element={<ProtectedRoute element={<DoctorSummary />} />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        theme="colored"
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

