import { useState } from "react";
import styled from "styled-components";
import type { Todo } from "../types";
import TodoItem from "./TodoItem";
import EditTodo from "./EditTodo";

interface TodoListProps {
  todos: Todo[];
onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEditSave: (id: number, text: string) => void;
}

const Container = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #888;
  margin: 20px 0;
`;

const TodoList = ({ todos, onToggle, onDelete, onEditSave }: TodoListProps) => {
  const [editId, setEditId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditId(id);
  };

  const handleSave = (id: number, text: string) => {
    onEditSave(id, text);
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
  };

  if (todos.length === 0) {
    return <EmptyMessage>Нет задач</EmptyMessage>;
  }

  return (
    <Container>
      {todos.map((todo) =>
        editId === todo.id ? (
          <li key={todo.id}>
            <EditTodo
              initialText={todo.text}
              onSave={(text) => handleSave(todo.id, text)}
              onCancel={handleCancel}
            />
          </li>
        ) : (
          <TodoItem
            key={todo.id}
            todo={todo}
          onToggle={(id) => onToggle(id, !todo.completed)}
            onDelete={onDelete}
            onEdit={handleEdit}
          />
        )
      )}
    </Container>
  );
};

export default TodoList;