import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void; // ➕ новый проп
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 0",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          flex: 1,
        }}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onEdit(todo.id)} // 👈 новая кнопка
        style={{
          color: "blue",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        ✎
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          color: "red",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </li>
  );
};

export default TodoItem;
