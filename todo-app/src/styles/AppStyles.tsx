import styled, { keyframes, createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle<{
  $themeMode: "light" | "dark";
}>`
  body {
    margin: 0;
    font-family: "Inter", system-ui, sans-serif;
    background: ${({ $themeMode }) =>
      $themeMode === "light"
        ? "rgba(255, 255, 255, 0.7))"
        : "rgba(40, 40, 40, 0.7)"};
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#111" : "#f1f1f1")};
    transition: background 0.4s ease, color 0.3s ease;
    min-height: 100vh;
  }

  .auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
  }

  .auth-form,
  .password-form {
    background: ${({ $themeMode }) =>
      $themeMode === "light" ? "white" : "#2d2d2d"};
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    border: 1px solid ${({ $themeMode }) =>
      $themeMode === "light" ? "#ddd" : "#444"};
  }

  .auth-form h2,
  .password-form h3 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#333" : "#f1f1f1")};
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#333" : "#f1f1f1")};
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ $themeMode }) =>
      $themeMode === "light" ? "#ddd" : "#555"};
    border-radius: 4px;
    font-size: 1rem;
    background: ${({ $themeMode }) =>
      $themeMode === "light" ? "white" : "#333"};
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#333" : "#f1f1f1")};
  }

  .form-group input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }

  .submit-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 1rem;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #357ae8;
  }

  .submit-button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }

  .error-message {
    background-color: #fdeded;
    color: #e74c3c;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #f5c6c6;
  }

  .success-message {
    background-color: #edf7ed;
    color: #27ae60;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #c6e7c6;
  }

  .field-error {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }

  /* Стили для профиля */
  .profile-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .profile-info {
    background: ${({ $themeMode }) =>
      $themeMode === "light" ? "white" : "#2d2d2d"};
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    border: 1px solid ${({ $themeMode }) =>
      $themeMode === "light" ? "#ddd" : "#444"};
  }

  .info-item {
    margin-bottom: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid ${({ $themeMode }) =>
      $themeMode === "light" ? "#ddd" : "#444"};
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#333" : "#f1f1f1")};
  }

  .info-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  
  .header {
  background: ${({ $themeMode }) =>
    $themeMode === "light"
      ? "rgba(255, 255, 255, 0.7)"
      : "rgba(40, 40, 40, 0.7)"};  
  border-bottom: 1px solid ${({ $themeMode }) =>
    $themeMode === "light" ? "#ddd" : "#333"};
  padding: 1rem 0;
  backdrop-filter: blur(10px); 
  border-radius: 10px;
}

  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4a90e2;
    text-decoration: none;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .nav-link {
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#333" : "#f1f1f1")};
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .nav-link:hover {
    background-color: ${({ $themeMode }) =>
      $themeMode === "light" ? "#f5f5f5" : "#333"};
  }

  .nav-button {
    background: none;
    border: 1px solid ${({ $themeMode }) =>
      $themeMode === "light" ? "#ddd" : "#555"};
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#333" : "#f1f1f1")};
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .nav-button:hover {
    background-color: ${({ $themeMode }) =>
      $themeMode === "light" ? "#f5f5f5" : "#333"};
  }

  .user-email {
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#6c757d" : "#aaa")};
    margin-right: 1rem;
  }

  .theme-toggle {
    background: none;
    border: 1px solid ${({ $themeMode }) =>
      $themeMode === "light" ? "#ddd" : "#555"};
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    transition: transform 0.2s;
  }

  .theme-toggle:hover {
    transform: scale(1.1);
  }

 
  .error-boundary {
    padding: 2rem;
    text-align: center;
    background: #fdeded;
    border: 1px solid #f5c6c6;
    border-radius: 8px;
    margin: 2rem;
  }

  .error-boundary h2 {
    color: #e74c3c;
    margin-bottom: 1rem;
  }

  .error-boundary details {
    margin-bottom: 1rem;
    color: #6c757d;
  }

  .error-boundary button {
    background: #4a90e2;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
 
`;

export const MainContainer = styled.div`
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Card = styled.div<{ $themeMode: "light" | "dark" }>`
  background: ${({ $themeMode }) =>
    $themeMode === "light"
      ? "rgba(255, 255, 255, 0.7)"
      : "rgba(40, 40, 40, 0.7)"};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
  width: 100%;
  animation: ${fadeIn} 0.5s ease;
  margin-top: 20px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 20px;
  text-align: center;
  font-weight: 700;
`;

export const ThemeButton = styled.button<{ $themeMode: "light" | "dark" }>`
  margin-bottom: 16px;
  padding: 10px 18px;
  background: ${({ $themeMode }) =>
    $themeMode === "light"
      ? "linear-gradient(135deg, #2196f3, #64b5f6)"
      : "linear-gradient(135deg, #90caf9, #42a5f5)"};
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
`;

export const FilterSortRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;

  select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    cursor: pointer;
    transition: border 0.2s ease;
    &:focus {
      outline: none;
      border: 1px solid #2196f3;
    }
  }
`;

export const ErrorAlert = styled.div<{ $themeMode: "light" | "dark" }>`
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? "#ffebee" : "#d32f2f"};
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#c62828" : "#fff")};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? "#ffcdd2" : "#b71c1c")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

export const LoadingOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  z-index: 10;
`;

export const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2196f3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;
