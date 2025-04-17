import { useState, useEffect, useCallback } from 'react';
import { App } from 'antd';

/**
 * Custom hook to manage favorited dog IDs, persisting to localStorage.
 */
export function useFavorites(): [Set<string>, (dogId: string) => void] {
  const { message: messageApi } = App.useApp();
  const [favoritedDogs, setFavoritedDogs] = useState<Set<string>>(() => {
    try {
      const savedFavorites = localStorage.getItem('favoritedDogs');
      return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'favoritedDogs',
        JSON.stringify(Array.from(favoritedDogs))
      );
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favoritedDogs]);

  const toggleFavorite = useCallback(
    (dogId: string) => {
      setFavoritedDogs((prev) => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(dogId)) {
          newFavorites.delete(dogId);
          messageApi.info('Removed from favorites!');
        } else {
          newFavorites.add(dogId);
          messageApi.success('Added to favorites!');
        }
        return newFavorites;
      });
    },
    [messageApi]
  );

  return [favoritedDogs, toggleFavorite];
}
