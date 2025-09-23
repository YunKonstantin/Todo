import { useState } from "react";

interface EditTodoProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}

const EditTodo = ({ initialText, onSave, onCancel }: EditTodoProps) => {
  const [value, setValue] = useState(initialText);

  const handleSave = () => {
    if (value.trim()) onSave(value.trim());
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input value={value} onChange={(e) => setValue(e.target.value)} style={{ flex: 1, padding: 6 }} />
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
};

export default EditTodo;
