import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./components/AppProviders";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TodoDashboard } from "./components/TodoDashboard";
import { AppContainer, MainContainer } from "./styles/AppStyles";
import LoginPage from "./pages/LoginPages";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export function AppContent() {
  return (
    <AppContainer>
      <MainContainer>
        <Routes >
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TodoDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainContainer>
    </AppContainer>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
