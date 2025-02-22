'use client';

interface ModalButtonsProps {
  characterCount: number;
  maxChars: number;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ModalButtons({
  characterCount,
  maxChars,
  onCancel,
  onSubmit,
}: ModalButtonsProps) {
  return (
    <div className="flex justify-between items-center text-gray-300/90 text-sm">
      <span className="font-light tracking-wide">
        {characterCount}/{maxChars} characters
      </span>
      <div className="space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl font-medium tracking-wide
                    bg-[rgba(255,255,255,0.03)]
                    shadow-[6px_6px_12px_rgba(0,0,0,0.2),_-6px_-6px_12px_rgba(255,255,255,0.08)]
                    hover:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(255,255,255,0.08)]
                    hover:translate-y-[1px]
                    active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),_inset_-4px_-4px_8px_rgba(255,255,255,0.08)]
                    transition-all duration-200 ease-in-out"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-2.5 rounded-xl font-medium tracking-wide
                    bg-[rgba(255,255,255,0.06)]
                    shadow-[6px_6px_12px_rgba(0,0,0,0.2),_-6px_-6px_12px_rgba(255,255,255,0.08)]
                    hover:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(255,255,255,0.08)]
                    hover:translate-y-[1px]
                    active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),_inset_-4px_-4px_8px_rgba(255,255,255,0.08)]
                    transition-all duration-200 ease-in-out"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
