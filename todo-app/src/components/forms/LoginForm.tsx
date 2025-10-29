import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "Требуется адрес эл. Почты";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Указанная почта не подходит";
    }

    if (!formData.password) {
      newErrors.password = "Требуется пароль";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль не может быть короче 6 символов";
    }

    setFormErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const result = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(result)) {
        navigate("/");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Вход</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Почта:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {formErrors.email && (
          <span className="field-error">{formErrors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {formErrors.password && (
          <span className="field-error">{formErrors.password}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="submit-button"
      >
        {status === "loading" ? "Logging in..." : "Войти"}
      </button>
    </form>
  );
};
export default LoginForm
