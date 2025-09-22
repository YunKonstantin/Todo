import { useState } from "react";
import type { Todo } from "../types";
import TodoItem from "./TodoItem";
import EditTodo from "./EditTodo";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEditSave: (id: number, text: string) => void; // сохраняем редактирование
}

const TodoList = ({ todos, onToggle, onDelete, onEditSave }: TodoListProps) => {
  const [editId, setEditId] = useState<number | null>(null);

  if (todos.length === 0) {
    return <p>Нет задач</p>;
  }

  return (
    <ul>
      {todos.map((todo) =>
        editId === todo.id ? (
          <li key={todo.id}>
            <EditTodo
              initialText={todo.text}
              onSave={(newText) => {
                onEditSave(todo.id, newText);
                setEditId(null);
              }}
              onCancel={() => setEditId(null)}
            />
          </li>
        ) : (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={() => setEditId(todo.id)} // переключаем на редактирование
          />
        )
      )}
    </ul>
  );
};

export default TodoList;
