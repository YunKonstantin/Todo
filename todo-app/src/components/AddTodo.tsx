import { useState } from "react";

interface AddTodoProps {
  onAdd: (text: string) => void;
}

const AddTodo = ({ onAdd }: AddTodoProps) => {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText("");
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Новая задача..."
        style={{ flex: 1, padding: 8 }}
      />
      <button onClick={handleAdd}>Добавить</button>
    </div>
  );
};

export default AddTodo;
