import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import PatientDetails from "./pages/PatientDetails";
import EditPatient from "./pages/EditPatient";
import Appointments from "./pages/Appointments";
import Medicines from "./pages/Medicines";
import Billing from "./pages/Billing";
import Followups from "./pages/Followups";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function AppLayout() {
  const location = useLocation();

  // Login page lo Sidebar hide cheyyi
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex bg-slate-100 min-h-screen">
      {!isLoginPage && <Sidebar />}

      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Patients */}
          <Route path="/patients" element={<Patients />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/patient-details/:id" element={<PatientDetails />} />
          <Route path="/edit-patient/:id" element={<EditPatient />} />

          {/* Other Pages */}
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/followups" element={<Followups />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}