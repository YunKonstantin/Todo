import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import { fetchUserProfile, logoutUser } from "../store/slices/authSlice";
import { useEffect } from "react";

export const Header = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [token, user, dispatch]);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <nav className="nav">
          {token ? (
            <>
              <span className="user-email">Привет, {user?.email}</span>
              <Link to="/" className="nav-link">
                Задачи
              </Link>
              <Link to="/profile" className="nav-link">
                Профиль
              </Link>
              <button onClick={handleLogout} className="nav-button">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Войти
              </Link>
              <Link to="/register" className="nav-link">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
