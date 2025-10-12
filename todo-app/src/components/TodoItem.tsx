import styled from "styled-components";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const Container = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const Text = styled.span<{ $completed: boolean }>`
  flex: 1;
  cursor: pointer;
  text-decoration: ${({ $completed }) => $completed ? "line-through" : "none"};
  color: ${({ $completed }) => $completed ? "#888" : "inherit"};
`;

const EditButton = styled.button`
  color: white;
  background-color: #2196f3;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1976d2;
  }
`;

const DeleteButton = styled.button`
  color: white;
  background-color: #f44336;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleEdit = () => {
    onEdit(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <Container>
      <Checkbox
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <Text 
        $completed={todo.completed}
        onDoubleClick={handleEdit}
      >
        {todo.text}
      </Text>
      <EditButton onClick={handleEdit}>
        ✎
      </EditButton>
      <DeleteButton onClick={handleDelete}>
        ✕
      </DeleteButton>
    </Container>
  );
};

export default TodoItem;