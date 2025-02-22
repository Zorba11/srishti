'use client';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  return (
    <div
      className="w-full h-48 rounded-2xl
                 flex flex-col items-center justify-center p-4
                 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm
                 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.2),_inset_-8px_-8px_16px_rgba(255,255,255,0.1)]
                 group transition-all duration-300 ease-in-out
                 hover:shadow-[inset_12px_12px_24px_rgba(0,0,0,0.25),_inset_-12px_-12px_24px_rgba(255,255,255,0.12)]
                 relative overflow-hidden"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        if (files[0]) onImageUpload(files[0]);
      }}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files[0]) onImageUpload(files[0]);
        }}
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center"
      >
        <div className="text-gray-400 transform group-hover:scale-105 transition-transform duration-300">
          <svg
            className="w-12 h-12 mx-auto mb-3 opacity-70 group-hover:opacity-90 transition-opacity duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-light tracking-wide">
            Drag and drop an image here, or click to select
          </p>
        </div>
      </label>
    </div>
  );
}
