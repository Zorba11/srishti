'use client';

interface ControlDialProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  isActive?: boolean;
  isCompleted?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12 sm:w-16 sm:h-16',
  md: 'w-16 h-16 sm:w-20 sm:h-20',
  lg: 'w-20 h-20 sm:w-24 sm:h-24',
};

const iconSizes = {
  sm: 'w-4 h-4 sm:w-6 sm:h-6',
  md: 'w-6 h-6 sm:w-8 sm:h-8',
  lg: 'w-8 h-8 sm:w-10 sm:h-10',
};

const labelSizes = {
  sm: 'text-xs sm:text-sm',
  md: 'text-sm sm:text-base',
  lg: 'text-base sm:text-lg',
};

export function ControlDial({
  label,
  icon: Icon,
  onClick,
  isActive = false,
  isCompleted = false,
  size = 'md',
  disabled = false,
}: ControlDialProps) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          transform transition-all duration-300 ease-out
          bg-[#1A0B3F]
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]'
              : `
                shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.1)]
                hover:shadow-[2px_2px_5px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.1)]
                active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]
                hover:scale-[1.02] active:scale-[0.98]
              `
          }
          flex items-center justify-center relative
          focus:outline-none
          ${
            isActive && !disabled
              ? 'border-2 border-emerald-500/50'
              : isCompleted && !disabled
              ? 'border-2 border-blue-400/50'
              : 'border border-neutral-700'
          }
          ${
            isActive && !disabled
              ? 'after:absolute after:inset-0 after:rounded-full after:bg-emerald-500/5'
              : isCompleted && !disabled
              ? 'after:absolute after:inset-0 after:rounded-full after:bg-blue-400/5'
              : ''
          }
        `}
      >
        <div className="relative">
          <Icon
            className={`${iconSizes[size]} transition-colors duration-300 ${
              isActive && !disabled
                ? 'text-emerald-400'
                : isCompleted && !disabled
                ? 'text-blue-400'
                : 'text-neutral-300'
            } ${disabled ? 'opacity-50' : ''}`}
          />
          {isCompleted && !disabled && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
      </button>
      <span
        className={`
          ${labelSizes[size]} 
          font-medium 
          tracking-wide 
          transition-colors 
          duration-300 
          ${
            isActive && !disabled
              ? 'text-emerald-400'
              : isCompleted && !disabled
              ? 'text-blue-400'
              : 'text-neutral-300'
          }
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        {label}
      </span>
    </div>
  );
}
