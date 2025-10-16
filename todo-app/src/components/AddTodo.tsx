import { useState } from "react";
import styled from "styled-components";

interface AddTodoProps {
  onAdd: (text: string) => void;
  theme?: "light" | "dark";
  disabled?: boolean; // Добавляем disabled проп
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input<{ $themeMode: "light" | "dark"; disabled?: boolean }>`
  flex: 1;
  padding: 8px;
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? "#ccc" : "#555")};
  border-radius: 4px;
  background-color: ${({ $themeMode }) =>
    $themeMode === "light" ? "#fff" : "#333"};
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#000" : "#fff")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px
      ${({ $themeMode }) => ($themeMode === "light" ? "#2196f3" : "#90caf9")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = styled.button<{ $themeMode: "light" | "dark"; disabled?: boolean }>`
  padding: 8px 12px;
  background-color: ${({ $themeMode, disabled }) =>
    disabled ? '#ccc' : $themeMode === "light" ? "#2196f3" : "#90caf9"};
  color: ${({ $themeMode, disabled }) => 
    disabled ? '#666' : ($themeMode === "light" ? "#fff" : "#000")};
  border: none;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    background-color: ${({ $themeMode, disabled }) =>
      disabled ? '#ccc' : $themeMode === "light" ? "#1976d2" : "#64b5f6"};
  }
`;

const ErrorText = styled.p`
  color: red;
  margin: 0;
  font-size: 0.875rem;
`;

const AddTodo = ({ onAdd, theme = "light", disabled = false }: AddTodoProps) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (disabled) return; 
    
    if (!text.trim()) {
      setError("Поле не может быть пустым");
      return;
    }
    onAdd(text.trim());
    setText("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      handleAdd();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; 
    
    setText(e.target.value);
    if (error) setError("");
  };

  return (
    <Container>
      <InputRow>
        <Input
          $themeMode={theme}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Добавление..." : "Новая задача..."}
          disabled={disabled}
        />
        <Button 
          $themeMode={theme} 
          onClick={handleAdd}
          disabled={disabled}
        >
          {disabled ? "..." : "Добавить"}
        </Button>
      </InputRow>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default AddTodo;