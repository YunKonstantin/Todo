// src/components/AddTodo.tsx
import { useState } from "react";
import styled from "styled-components";

interface AddTodoProps {
  onAdd: (text: string) => void;
  theme?: "light" | "dark";
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

const Input = styled.input<{ themeMode: "light" | "dark" }>`
  flex: 1;
  padding: 8px;
  border: 1px solid
    ${({ themeMode }) => (themeMode === "light" ? "#ccc" : "#555")};
  border-radius: 4px;
  background-color: ${({ themeMode }) =>
    themeMode === "light" ? "#fff" : "#333"};
  color: ${({ themeMode }) => (themeMode === "light" ? "#000" : "#fff")};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px
      ${({ themeMode }) => (themeMode === "light" ? "#2196f3" : "#90caf9")};
  }
`;

const Button = styled.button<{ themeMode: "light" | "dark" }>`
  padding: 8px 12px;
  background-color: ${({ themeMode }) =>
    themeMode === "light" ? "#2196f3" : "#90caf9"};
  color: ${({ themeMode }) => (themeMode === "light" ? "#fff" : "#000")};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ themeMode }) =>
      themeMode === "light" ? "#1976d2" : "#64b5f6"};
  }
`;

const ErrorText = styled.p`
  color: red;
  margin: 0;
  font-size: 0.875rem;
`;

const AddTodo = ({ onAdd, theme = "light" }: AddTodoProps) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!text.trim()) {
      setError("Поле не может быть пустым");
      return;
    }
    onAdd(text.trim());
    setText("");
    setError("");
  };

  return (
    <Container>
      <InputRow>
        <Input
          themeMode={theme}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Новая задача..."
        />
        <Button themeMode={theme} onClick={handleAdd}>
          Добавить
        </Button>
      </InputRow>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default AddTodo;
