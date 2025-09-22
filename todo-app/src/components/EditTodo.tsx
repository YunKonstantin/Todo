import { useState } from "react";

interface EditTodoProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}

const EditTodo = ({ initialText, onSave, onCancel }: EditTodoProps) => {
  const [value, setValue] = useState(initialText);

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 px-3 py-1 border rounded-md"
      />
      <button
        onClick={handleSave}
        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Сохранить
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
      >
        Отмена
      </button>
    </div>
  );
};

export default EditTodo;
