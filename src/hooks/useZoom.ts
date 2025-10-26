
import { useEffect, useCallback } from 'react';

interface UseZoomProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export const useZoom = ({
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
}: UseZoomProps) => {
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        if (e.deltaY < 0 && canZoomIn) {
          onZoomIn();
        } else if (e.deltaY > 0 && canZoomOut) {
          onZoomOut();
        }
      }
    },
    [onZoomIn, onZoomOut, canZoomIn, canZoomOut]
  );

  const handleKeyboard = useCallback(
    (e: KeyboardEvent) => {
      if ((e.key === '+' || e.key === '=') && canZoomIn) {
        e.preventDefault();
        onZoomIn();
      } else if ((e.key === '-' || e.key === '_') && canZoomOut) {
        e.preventDefault();
        onZoomOut();
      }
    },
    [onZoomIn, onZoomOut, canZoomIn, canZoomOut]
  );

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [handleWheel, handleKeyboard]);

  return { handleWheel, handleKeyboard };
};