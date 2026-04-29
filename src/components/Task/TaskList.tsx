// src/components/Task/TaskList.tsx
import { type Task } from "../../types/task.type";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  dateStr: string;
  onTaskClick?: (task: Task) => void;
  onShowAll?: () => void;
  maxItems?: number;
}

const TaskList = ({
  tasks,
  dateStr,
  onTaskClick,
  onShowAll,
  maxItems = 4,
}: TaskListProps) => {
  const visible = tasks.slice(0, maxItems);
  const remaining = tasks.length - maxItems;

  if (tasks.length === 0) {
    return (
      <div className="text-xs text-gray-400 text-center py-3">
        Chưa có công việc nào
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {visible.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          dateStr={dateStr}
          onClick={() => onTaskClick?.(task)}
        />
      ))}
      {remaining > 0 && (
        <button
          onClick={onShowAll}
          className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] text-center py-1 hover:underline transition-colors"
        >
          +{remaining} công việc khác
        </button>
      )}
    </div>
  );
};

export default TaskList;
