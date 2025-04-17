import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getBreeds as apiGetBreeds } from '../services/api';

interface UseBreedsResult {
  breeds: string[];
  loading: boolean;
  error: string | null;
}

export function useBreeds(): UseBreedsResult {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedBreeds = await apiGetBreeds();
        setBreeds(fetchedBreeds.sort());
      } catch (err) {
        console.error('Error fetching breeds:', err);
        const errorMsg =
          'Could not load dog breeds. Please try refreshing the page.';
        setError(errorMsg);
        message.error(errorMsg);
        setBreeds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  return { breeds, loading, error };
}
