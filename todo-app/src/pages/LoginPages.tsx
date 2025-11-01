import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "../components/forms/LoginForm";
import type { RootState } from "../store";

const LoginPage = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  console.log("🔐 LoginPage проверка токена:", token);

  const localToken = localStorage.getItem("accessToken");

  if (localToken) {
    console.log("✅ Токен найден, перенаправление на /");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
