// Định nghĩa sẵn để sau này code tự động nhắc lệnh (Autocomplete)
export type RepeatUnit = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'FIXED_DAYS';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  isMaster?: boolean;
  repeatUnit?: RepeatUnit;
  repeatInterval?: number;
  startDate?: string;
  masterId?: string;
  categoryId?: any; // Có thể định nghĩa thêm interface Category sau
  isVirtual?: boolean; // Cờ nhận diện task ảo
}