'use client';
import Link from 'next/link';

interface FrameTileProps {
  frameIndex: number;
}

export const FrameTile = ({ frameIndex }: FrameTileProps) => {
  return (
    <Link href={`/frames/${frameIndex}`}>
      <div className="flex items-center justify-center bg-gray-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer aspect-square">
        <span className="text-xl font-semibold text-gray-800">
          {frameIndex + 1}
        </span>
      </div>
    </Link>
  );
};
