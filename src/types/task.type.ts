export type RepeatUnit =
  | "NONE"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY"
  | "FIXED_DAYS";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  isStarred?: boolean;
  isMaster?: boolean;
  repeatUnit?: RepeatUnit;
  repeatInterval?: number;
  startDate?: string;
  masterId?: string;
  categoryId?: any;
  isVirtual?: boolean;
  userId?: string;
}
