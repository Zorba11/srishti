import React from 'react';

export interface ModeToggleSwitchProps {
  value: boolean;
  onToggle: () => void;
}

export function ModeToggleSwitch({ value, onToggle }: ModeToggleSwitchProps) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center cursor-pointer select-none"
      role="switch"
      aria-checked={value}
      title={value ? 'Zero-Shot Mode' : 'Standard Mode'}
    >
      <div className="relative">
        <div
          className={`w-16 h-8 rounded-full transition-colors duration-300 ease-in-out ${
            value
              ? 'bg-purple-600/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]'
              : 'bg-neutral-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'
          }`}
        ></div>
        <div
          className={`absolute top-1 left-1 w-6 h-6 rounded-full transform transition-all duration-300 ease-in-out ${
            value
              ? 'translate-x-8 bg-purple-200 shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
              : 'bg-neutral-400 shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
          }`}
        ></div>
      </div>
    </div>
  );
}
