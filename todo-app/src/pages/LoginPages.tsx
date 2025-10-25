import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "../components/forms/LoginForm";
import type { RootState } from "../store";


const LoginPage = () => {
    const {token} = useSelector((state:RootState)=>state.auth)
     if (token) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="auth-page">
      <LoginForm />
    </div>
  );
};
export default LoginPage;