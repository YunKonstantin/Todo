import { useState } from "react";

interface EditTodoProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}

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

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexDirection: "column",
        width: "100%",
      }}
    >
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError("");
        }}
        style={{
          flex: 1,
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
        placeholder="Введите задачу..."
      />

      {error && <span style={{ color: "red", fontSize: 12 }}>{error}</span>}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSave}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#2196f3",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Сохранить
        </button>

        <button
          onClick={onCancel}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#f44336",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Отменить
        </button>
      </div>
    </div>
  );
};

export default EditTodo;
