import { Navigate } from "react-router-dom";

import LoginForm from "../components/forms/LoginForm";

const LoginPage = () => {
  const localToken = localStorage.getItem("accessToken");

  if (localToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
