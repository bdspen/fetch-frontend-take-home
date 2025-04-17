import { useState, useEffect } from 'react';
import { searchDogs, getDogsByIds } from '../services/api';
import { Dog, SearchDogsParams } from '../services/types';

interface UseDogApiSearchResult {
  dogs: Dog[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

export function useDogApiSearch(
  params: SearchDogsParams | null
): UseDogApiSearchResult {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) {
      setDogs([]);
      setTotal(0);
      setError(null);
      setIsLoading(false);
      return;
    }

    const fetchDogs = async () => {
      setIsLoading(true);
      setError(null);
      setDogs([]);
      setTotal(0);

      try {
        const searchResponse = await searchDogs(params);

        if (searchResponse?.resultIds?.length > 0) {
          const dogsData = await getDogsByIds(searchResponse.resultIds);
          setDogs(dogsData);
          setTotal(searchResponse.total);
        } else {
          setDogs([]);
          setTotal(searchResponse?.total ?? 0);
        }
      } catch (err) {
        console.error('Error during dog API search:', err);
        setError(
          'Failed to fetch dogs. Please try adjusting your filters or refresh the page.'
        );
        setDogs([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, [params]);

  return {
    dogs,
    total,
    isLoading,
    error,
  };
}
