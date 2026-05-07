interface CompletedCardProps {
  completed: number;
  periodLabel: string;
}

export const CompletedCard = ({ completed, periodLabel }: CompletedCardProps) => {
  return (
    <div className="bg-white p-7 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
      <h3 className="text-[17px] font-bold text-slate-800 mb-3">Hoàn thành</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-extrabold text-slate-800 tracking-tight">{completed}</span>
        <span className="text-sm font-semibold text-slate-400">{periodLabel}</span>
      </div>
    </div>
  );
};
