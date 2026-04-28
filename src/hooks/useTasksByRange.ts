// src/hooks/useTasksByRange.ts
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../api/task.api";
import dayjs from "dayjs";

type RangeType = "day" | "week" | "month";

export const useTasksByRange = (
  date: dayjs.Dayjs,
  range: RangeType,
  isCompleted: boolean,
) => {
  const startDate =
    range === "day"
      ? date.format("YYYY-MM-DD")
      : range === "week"
        ? date.startOf("week").format("YYYY-MM-DD")
        : date.startOf("month").format("YYYY-MM-DD");

  const endDate =
    range === "day"
      ? date.format("YYYY-MM-DD")
      : range === "week"
        ? date.endOf("week").format("YYYY-MM-DD")
        : date.endOf("month").format("YYYY-MM-DD");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", startDate, endDate, isCompleted],
    queryFn: () => taskApi.getTasks(startDate, endDate, isCompleted),
    staleTime: 1000 * 60 * 2,
  });

  return { tasks, isLoading, startDate, endDate };
};
