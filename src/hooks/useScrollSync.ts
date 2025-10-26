
import { useEffect, useRef, useCallback } from 'react';

export const useScrollSync = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const syncScroll = useCallback(() => {
    if (!scrollContainerRef.current || !headerRef.current || isScrolling.current) {
      return;
    }

    isScrolling.current = true;
    headerRef.current.scrollLeft = scrollContainerRef.current.scrollLeft;
    
    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', syncScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', syncScroll);
    };
  }, [syncScroll]);

  return {
    scrollContainerRef,
    headerRef,
  };
};