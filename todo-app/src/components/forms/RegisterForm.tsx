import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../store/slices/authSlice";
import { type AppDispatch, type RootState } from "../../store";
import  PasswordInput  from "../InputPassword";

export const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    age: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    age: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      age: "",
    };

    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    } else if (formData.password.length > 30) {
      newErrors.password = "Пароль не может быть длиннее 30 символов";
    }

    if (formData.age) {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        newErrors.age = "Возраст должен быть от 0 до 150";
      }
    }

    setFormErrors(newErrors);
    return !newErrors.email && !newErrors.password && !newErrors.age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData: { email: string; password: string; age?: number } = {
        email: formData.email,
        password: formData.password,
      };

      if (formData.age) {
        submitData.age = parseInt(formData.age);
      }

      const result = await dispatch(registerUser(submitData));

      if (registerUser.fulfilled.match(result)) {
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
      <h2>Регистрация</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          maxLength={50}
        />
        {formErrors.email && (
          <span className="field-error">{formErrors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль:</label>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Пароль"
        />
        {formErrors.password && (
          <span className="field-error">{formErrors.password}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="age">Возраст (необязательно):</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="0"
          max="150"
        />
        {formErrors.age && (
          <span className="field-error">{formErrors.age}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="submit-button"
      >
        {status === "loading" ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  );
};
export default RegisterForm;
