import type { OverviewGridProps } from '../../../types/stat.type';
import { StatCard } from './StatCard';
import { WarningFilled , StarFilled , CarryOutFilled} from '@ant-design/icons';

export const OverviewGrid = ({ overview }: OverviewGridProps) => {
  const cards = [
    {
      title: 'Tỉ lệ hoàn thành',
      value: `${overview.completionRate}%`,
    //   description: 'Tỉ lệ hoàn thành trong khoảng thời gian này',
      color: 'text-violet-600',
      progress: overview.completionRate,
    },
    {
      title: 'Quá hạn',
      value: overview.overdue,
      icon: <WarningFilled />,
      description: 'Cần xử lý ngay',
      color: 'text-red-500',
    },
    {
      title: 'Quan trọng',
      value: overview.important,
      icon: <StarFilled /> ,
      description: 'Có gắn dấu sao',
      color: 'text-amber-500',
    },
    {
      title: 'Tiến độ',
      value: `${overview.completed}/${overview.total}`,
      description: `${overview.pending} việc đang chờ hoàn thành`,
      icon: <CarryOutFilled />,
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};
