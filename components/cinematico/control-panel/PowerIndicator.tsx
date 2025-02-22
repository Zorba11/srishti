'use client';

interface PowerIndicatorProps {
  isOn: boolean;
  onClick: () => void;
}

export function PowerIndicator({ isOn, onClick }: PowerIndicatorProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <div className="relative">
        <div
          className={`
            w-3 h-3 rounded-full 
            ${isOn ? 'bg-emerald-500' : 'bg-red-500'}
            transition-colors duration-300
            ${
              isOn
                ? 'shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                : 'shadow-[0_0_12px_rgba(239,68,68,0.6)]'
            }
          `}
        />
      </div>
      {/* <span className="text-sm font-medium tracking-wider text-neutral-300 group-hover:text-neutral-100 transition-colors duration-300">
        POWER
      </span> */}
    </div>
  );
}
