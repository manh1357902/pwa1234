
import React from 'react';
import type { Photo } from '../types';
import { TrashIcon } from './Icons';

interface GalleryViewProps {
  photos: Photo[];
  onDelete: (id: string) => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ photos, onDelete }) => {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h2 className="text-xl font-semibold">Empty Gallery</h2>
        <p className="text-center mt-2">Use the camera to take your first photo.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="relative group aspect-square">
            <img
              src={photo.dataUrl}
              alt={`Captured at ${new Date(photo.timestamp).toLocaleString()}`}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={() => onDelete(photo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 bg-red-600 hover:bg-red-700 rounded-full text-white"
                aria-label="Delete photo"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="absolute bottom-1 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
              {new Date(photo.timestamp).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryView;
