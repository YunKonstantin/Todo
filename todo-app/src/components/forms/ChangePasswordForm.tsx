import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";
import PasswordInput from "../InputPassword";

interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [success, setSuccess] = useState(false);

  const validateField = useCallback(
    (name: keyof FormData, value: string): string => {
      switch (name) {
        case "oldPassword":
          if (!value.trim()) return "Текущий пароль обязателен";
          return "";

        case "newPassword":
          if (!value.trim()) return "Новый пароль обязателен";
          if (value.length < 6) return "Пароль должен быть не менее 6 символов";
          if (value.length > 30)
            return "Пароль не может быть длиннее 30 символов";
          if (value === formData.oldPassword)
            return "Новый пароль должен отличаться от текущего";
          return "";

        case "confirmPassword":
          if (!value.trim()) return "Подтверждение пароля обязательно";
          if (value !== formData.newPassword) return "Пароли не совпадают";
          return "";

        default:
          return "";
      }
    },
    [formData.oldPassword, formData.newPassword]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      oldPassword: validateField("oldPassword", formData.oldPassword),
      newPassword: validateField("newPassword", formData.newPassword),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };

    setFormErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  }, [formData, validateField]);

  useEffect(() => {
    if (Object.values(touched).some((field) => field)) {
      validateForm();
    }
  }, [formData, touched, validateForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    setTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (formData.oldPassword === formData.newPassword) {
      setFormErrors((prev) => ({
        ...prev,
        newPassword: "Новый пароль должен отличаться от текущего",
      }));
      return;
    }

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
        setTouched({
          oldPassword: false,
          newPassword: false,
          confirmPassword: false,
        });
        setFormErrors({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else if (changePassword.rejected.match(result)) {
        // Обрабатываем ошибку от API (например, неверный старый пароль)
        // Ошибка уже будет в состоянии error из Redux
        setSuccess(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const isFormValid =
    Object.values(formErrors).every((error) => error === "") &&
    Object.values(formData).every((field) => field.trim() !== "") &&
    formData.oldPassword !== formData.newPassword;

  return (
    <form onSubmit={handleSubmit} className="password-form">
      <h3>Смена пароля</h3>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Пароль успешно изменен!</div>
      )}

      <div className="form-group">
        <label htmlFor="oldPassword">Текущий пароль:</label>
        <PasswordInput
          id="oldPassword"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Текущий пароль"
        />
        {formErrors.oldPassword && touched.oldPassword && (
          <span className="field-error">{formErrors.oldPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">Новый пароль:</label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Новый пароль"
        />
        {formErrors.newPassword && touched.newPassword && (
          <span className="field-error">{formErrors.newPassword}</span>
        )}

        {formData.oldPassword &&
          formData.newPassword &&
          formData.oldPassword === formData.newPassword &&
          touched.newPassword && (
            <span className="field-error">
              Новый пароль должен отличаться от текущего
            </span>
          )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Подтвердите новый пароль:</label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Подтвердите пароль"
        />
        {formErrors.confirmPassword && touched.confirmPassword && (
          <span className="field-error">{formErrors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading" || !isFormValid}
        className="submit-button"
      >
        {status === "loading" ? "Смена пароля..." : "Сменить пароль"}
      </button>
    </form>
  );
};
