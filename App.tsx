
import React, { useState, useEffect, useCallback } from 'react';
import type { Photo } from './types';
import CameraView from './components/CameraView';
import GalleryView from './components/GalleryView';
import { CameraIcon, GalleryIcon } from './components/Icons';

type View = 'camera' | 'gallery';

const App: React.FC = () => {
  const [view, setView] = useState<View>('camera');
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem('pwa-camera-photos');
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error) {
      console.error("Failed to load photos from local storage", error);
    }
  }, []);

  const savePhotos = useCallback((newPhotos: Photo[]) => {
    try {
      setPhotos(newPhotos);
      localStorage.setItem('pwa-camera-photos', JSON.stringify(newPhotos));
    } catch (error) {
      console.error("Failed to save photos to local storage", error);
    }
  }, []);

  const handleCapture = useCallback((dataUrl: string) => {
    const newPhoto: Photo = {
      id: `photo_${Date.now()}`,
      dataUrl,
      timestamp: Date.now(),
    };
    const updatedPhotos = [newPhoto, ...photos];
    savePhotos(updatedPhotos);
    setView('gallery');
  }, [photos, savePhotos]);

  const handleDelete = useCallback((id: string) => {
    const updatedPhotos = photos.filter(p => p.id !== id);
    savePhotos(updatedPhotos);
  }, [photos, savePhotos]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 text-white p-4 shadow-md z-10">
        <h1 className="text-xl font-bold text-center tracking-wider">PWA Camera</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        {view === 'camera' && <CameraView onCapture={handleCapture} />}
        {view === 'gallery' && <GalleryView photos={photos} onDelete={handleDelete} />}
      </main>

      <footer className="bg-gray-800 p-2 shadow-inner">
        <nav className="flex justify-around items-center">
          <button
            onClick={() => setView('camera')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 w-24 ${
              view === 'camera' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <CameraIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Camera</span>
          </button>
          <button
            onClick={() => setView('gallery')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 w-24 ${
              view === 'gallery' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <GalleryIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Gallery</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default App;
