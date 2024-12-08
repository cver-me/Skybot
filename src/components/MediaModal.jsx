import React from 'react';
import { X } from 'lucide-react';

export function MediaModal({ media, onClose }) {
  if (!media) return null;

  return (
  <div
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <button
    className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
    onClick={onClose}
    >
    <X className="w-6 h-6" />
    </button>
    {media.type === 'image' && (
    <img
      src={media.fullsize}
      alt={media.alt}
      className="max-w-full max-h-[90vh] object-contain"
    />
    )}
    {media.type === 'video' && (
    <video
      controls
      className="max-w-full max-h-[90vh]"
      src={media.fullsize}
    />
    )}
  </div>
  );
}