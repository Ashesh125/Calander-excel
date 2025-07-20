import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  date: string;
}

interface TaskItemProps {
  task: Task;
  onSave: (id: number, title: string) => void;
  onDelete: (id: number) => void;
  "data-title"?: string;
  "data-id"?: string;
}

const TaskItem = ({ task, onSave, onDelete, ...props }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onSave(task.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  if (!task) return null;

  return (
    <div
      className="task-item p-2 mb-2 bg-white rounded shadow cursor-pointer flex justify-between items-center group hover:bg-gray-50 transition-colors"
      data-title={props["data-title"] || task.title}
      data-id={props["data-id"] || task.id.toString()}
    >
      <div className="flex items-start space-x-2 min-w-0 flex-1">
        <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
        {isEditing ? (
            <textarea
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                autoFocus
                className="flex-grow min-w-0 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows={10}
                style={{ minHeight: '2.5rem' }} // Adjust as needed
            />
        ) : (
            <div className="truncate w-full" title={task.title}>
              {task.title}
            </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => {
              setEditedTitle(task.title);
              setIsEditing(true);
            }}
            aria-label="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="text-red-500 hover:text-red-700 focus:outline-none"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
