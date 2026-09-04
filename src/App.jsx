// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/AdminLayout";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

import AdminProfile from "./pages/AdminProfile";
import AdminProjects from "./pages/AdminProjects";
import AdminSections from "./pages/AdminSections";
import AdminTimeline from "./pages/AdminTimeline";
import AdminSocials from "./pages/AdminSocials";
import AdminSkills from "./pages/AdminSkills";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Route publique */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route protégée */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProfile />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProjects />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sections"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSections />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminTimeline />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/socials"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSocials />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSkills />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
