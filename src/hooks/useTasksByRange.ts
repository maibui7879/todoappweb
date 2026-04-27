// src/hooks/useTasksByRange.ts
import { useQueries } from "@tanstack/react-query";
import { taskApi } from "../api/task.api";
import { type Task } from "../types/task.type";
import dayjs from "dayjs";

type RangeType = "day" | "week" | "month";

const getDaysInRange = (date: dayjs.Dayjs, range: RangeType): string[] => {
  if (range === "day") {
    return [date.format("YYYY-MM-DD")];
  }
  if (range === "week") {
    const start = date.startOf("week");
    return Array.from({ length: 7 }, (_, i) =>
      start.add(i, "day").format("YYYY-MM-DD"),
    );
  }
  if (range === "month") {
    const start = date.startOf("month");
    const days = date.daysInMonth();
    return Array.from({ length: days }, (_, i) =>
      start.add(i, "day").format("YYYY-MM-DD"),
    );
  }
  return [];
};

export const useTasksByRange = (
  date: dayjs.Dayjs,
  range: RangeType,
  isCompleted: boolean,
) => {
  const days = getDaysInRange(date, range);

  const queries = useQueries({
    queries: days.map((day) => ({
      queryKey: ["tasks", day, isCompleted],
      queryFn: () => taskApi.getTasks(day, isCompleted),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  // Gộp tất cả tasks lại, loại trùng theo _id
  const allTasks: Task[] = [];
  const seenIds = new Set<string>();

  queries.forEach((q) => {
    if (q.data) {
      (q.data as Task[]).forEach((task) => {
        if (!seenIds.has(task._id)) {
          seenIds.add(task._id);
          allTasks.push(task);
        }
      });
    }
  });

  // Sort theo dueDate
  allTasks.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  return { tasks: allTasks, isLoading, days };
};
