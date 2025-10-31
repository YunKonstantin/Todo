import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state: RootState) => state.auth); // Добавьте user

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Добавьте useEffect для перенаправления при успешном входе
  useEffect(() => {
    if (user) {
      console.log("🔄 Перенаправление на главную страницу");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const validateForm = useCallback(() => {
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
  }, [formData.email, formData.password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("🔄 Начало обработки формы логина");

      // Усиленная защита от множественных отправок
      if (isSubmitting || status === "loading") {
        console.log("⏸️ Форма уже отправляется, игнорируем");
        return;
      }

      if (!validateForm()) {
        console.log("❌ Валидация не пройдена");
        return;
      }

      setIsSubmitting(true);
      console.log("📤 Отправка данных логина:", formData);

      try {
        const result = await dispatch(loginUser(formData));
        console.log("📥 Результат логина:", result);

        // УБЕРИТЕ навигацию отсюда - она будет в useEffect
        if (loginUser.fulfilled.match(result)) {
          console.log("✅ Успешный вход, пользователь сохранен в store");
          // navigate("/"); // УДАЛИТЕ ЭТУ СТРОКУ
        } else {
          console.log("❌ Ошибка входа в match:");
        }
      } catch (error) {
        console.error("💥 Неожиданная ошибка:", error);
      } finally {
        setIsSubmitting(false);
        console.log("🏁 Завершение обработки формы");
      }
    },
    [dispatch, formData, isSubmitting, status, validateForm]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Очищаем ошибку при вводе
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [formErrors]
  );

  const isLoading = status === "loading" || isSubmitting;

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
          disabled={isLoading}
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
          disabled={isLoading}
        />
        {formErrors.password && (
          <span className="field-error">{formErrors.password}</span>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? "Вход..." : "Войти"}
      </button>
    </form>
  );
};

export default LoginForm;
