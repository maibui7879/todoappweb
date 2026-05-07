interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, color, icon }: StatCardProps) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    {/* Thêm Progress bar mini ở đây nếu là thẻ Health */}
  </div>
);