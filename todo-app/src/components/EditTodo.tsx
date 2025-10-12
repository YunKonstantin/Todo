import { useState } from "react";
import styled from "styled-components";

interface EditTodoProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const SaveButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background-color: #2196f3;
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #1976d2;
  }
`;

const CancelButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background-color: #f44336;
  color: #fff;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #d32f2f;
  }
`;

const EditTodo = ({ initialText, onSave, onCancel }: EditTodoProps) => {
  const [value, setValue] = useState(initialText);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!value.trim()) {
      setError("Задача не может быть пустой");
      return;
    }
    onSave(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError("");
  };

  return (
    <Container>
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите задачу..."
        autoFocus
      />

      {error && <ErrorText>{error}</ErrorText>}

      <ButtonContainer>
        <SaveButton onClick={handleSave}>
          Сохранить
        </SaveButton>

        <CancelButton onClick={onCancel}>
          Отменить
        </CancelButton>
      </ButtonContainer>
    </Container>
  );
};

export default EditTodo;