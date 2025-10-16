import styled, { keyframes, createGlobalStyle } from "styled-components";

// Исправлено: createGlobalStyle используется напрямую, а не через styled.
export const GlobalStyle = createGlobalStyle<{
  $themeMode: "light" | "dark";
}>`
  body {
    margin: 0;
    font-family: "Inter", system-ui, sans-serif;
    background: ${({ $themeMode }) =>
      $themeMode === "light"
        ? "linear-gradient(135deg, #e0f7fa, #ffffff)"
        : "linear-gradient(135deg, #1e1e2f, #121212)"};
    color: ${({ $themeMode }) => ($themeMode === "light" ? "#111" : "#f1f1f1")};
    transition: background 0.4s ease, color 0.3s ease;
    min-height: 100vh;
  }
`;

// Остальной код остается без изменений
export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

export const MainContainer = styled.div`
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
