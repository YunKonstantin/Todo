import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";

export const ChangePasswordForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Текущий пароль обязателен";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Новый пароль обязателен";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Пароль должен быть не менее 6 символов";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтверждение пароля обязательно";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setFormErrors(newErrors);
    return (
      !newErrors.oldPassword &&
      !newErrors.newPassword &&
      !newErrors.confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (validateForm()) {
      const result = await dispatch(
        changePassword({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        })
      );

      if (changePassword.fulfilled.match(result)) {
        setSuccess(true);
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
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
    <form onSubmit={handleSubmit} className="password-form">
      <h3>Смена пароля</h3>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Пароль успешно изменен!</div>
      )}

      <div className="form-group">
        <label htmlFor="oldPassword">Текущий пароль:</label>
        <input
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />
        {formErrors.oldPassword && (
          <span className="field-error">{formErrors.oldPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">Новый пароль:</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        {formErrors.newPassword && (
          <span className="field-error">{formErrors.newPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Подтвердите новый пароль:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {formErrors.confirmPassword && (
          <span className="field-error">{formErrors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="submit-button"
      >
        {status === "loading" ? "Смена пароля..." : "Сменить пароль"}
      </button>
    </form>
  );
};
