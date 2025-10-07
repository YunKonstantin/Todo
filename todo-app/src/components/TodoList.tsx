import { useState } from "react";
import type { Todo } from "../utils/localStorage";
import TodoItem from "./TodoItem";
import EditTodo from "./EditTodo";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEditSave: (id: number, text: string) => void;
}

const TodoList = ({ todos, onToggle, onDelete, onEditSave }: TodoListProps) => {
  const [editId, setEditId] = useState<number | null>(null);

  if (todos.length === 0) return <p>Нет задач</p>;

  return (
    <ul style={{ padding: 0, listStyle: "none" }}>
      {todos.map((t) =>
        editId === t.id ? (
          <li key={t.id}>
            <EditTodo
              initialText={t.text}
              onSave={(text) => {
                onEditSave(t.id, text);
                setEditId(null);
              }}
              onCancel={() => setEditId(null)}
            />
          </li>
        ) : (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={() => setEditId(t.id)}
          />
        )
      )}
    </ul>
  );
};

export default TodoList;
