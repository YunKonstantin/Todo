import styled from "styled-components";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

const Button = styled.button<{ $themeMode: "light" | "dark" }>`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? "#333" : "#fff"};
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#fff" : "#000")};
  
  &:hover {
    opacity: 0.9;
  }
`;

const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <Button $themeMode={theme} onClick={onToggle}>
      Сменить тему
    </Button>
  );
};

export default ThemeToggle;