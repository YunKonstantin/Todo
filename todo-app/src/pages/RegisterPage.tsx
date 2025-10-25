import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RegisterForm from "../components/forms/RegisterForm";
import type { RootState } from "../store";

const RegisterPage = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
