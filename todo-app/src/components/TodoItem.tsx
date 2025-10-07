import type { Todo } from "../utils/localStorage";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 0",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        onDoubleClick={() => onEdit(todo.id)}
        style={{
          flex: 1,
          cursor: "pointer",
          textDecoration: todo.completed ? "line-through" : "none",
        }}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onEdit(todo.id)}
        style={{
          color: "white",
          backgroundColor: "#2196f3",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✎
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          color: "white",
          backgroundColor: "#f44336",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </li>
  );
};

export default TodoItem;
