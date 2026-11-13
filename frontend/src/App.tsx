
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Login from "./pages/Login";
import MyCourses from "./pages/MyCourses";
import CourseCatalog from "./pages/CourseCatalog";
import Resources from "./pages/Resources";
import Marketplace from "./pages/Marketplace";
import StudyLibrary from "./pages/StudyLibrary";
import Settings from "./pages/Settings";
import FacultyResources from './pages/FacultyResources'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/course-catalog" element={<CourseCatalog />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/study-library" element={<StudyLibrary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/faculty-resources" element={<FacultyResources />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
