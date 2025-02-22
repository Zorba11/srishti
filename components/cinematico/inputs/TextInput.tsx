'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

export default function TextInput({
  value,
  onChange,
  maxLength,
}: TextInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your movie description..."
      className="w-full h-32 p-5 rounded-2xl
                bg-[rgba(0,0,0,0.2)] text-gray-100
                backdrop-blur-sm
                shadow-[inset_8px_8px_16px_rgba(0,0,0,0.2),_inset_-8px_-8px_16px_rgba(255,255,255,0.1)]
                focus:shadow-[inset_12px_12px_24px_rgba(0,0,0,0.25),_inset_-12px_-12px_24px_rgba(255,255,255,0.12)]
                focus:outline-none
                placeholder-gray-400/70
                transition-all duration-300 ease-in-out
                text-base font-light tracking-wide
                resize-none"
      maxLength={maxLength}
    />
  );
}
