export interface OverviewResponse {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  important: number;
  completionRate: number
}

export interface OverviewStatCardProps {
  title: string;
  value: string | number;
  color: string;
  description?: string;
  progress?: number;
  icon?: React.ReactNode;
}

export interface OverviewGridProps {
  overview: OverviewResponse;
}

export interface MetaResponse {
  period: 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

export interface ByCategoryResponse {
  name: string;
  color: string;
  count: number;
  completed: number;
}

export interface DailyTrendItem {
  date: string;
  total: number;
  completed: number;
}

export interface StatsResponse {
  meta: MetaResponse;
  overview: OverviewResponse;
  byCategory: ByCategoryResponse[];
  dailyTrend: DailyTrendItem[];
}
export interface StatsMeta {
  period: 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

export interface StatsHeaderProps {
  period: 'week' | 'month' | 'year';
  setPeriod: (p: 'week' | 'month' | 'year') => void;
  dateRange: string;
  currentDate: string;
  onDateChange: (date: string) => void;
}