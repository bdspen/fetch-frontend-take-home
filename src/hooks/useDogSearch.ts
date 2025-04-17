import { useState, useMemo } from 'react';
import { Dog, SearchDogsParams } from '../services/types';
import { useDogApiSearch } from './useDogApiSearch';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from '../constants';

interface UseDogSearchResult {
  dogs: Dog[];
  loading: boolean;
  error: string | null;
  totalDogs: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

export function useDogSearch(
  selectedBreeds: string[],
  sortBy: string,
  sortOrder: string | null
): UseDogSearchResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const searchParams = useMemo(() => {
    const params: SearchDogsParams = {
      size: pageSize,
      from: (currentPage - 1) * pageSize,
    };

    if (selectedBreeds.length > 0) {
      params.breeds = selectedBreeds;
    }

    let effectiveSortBy = sortBy || DEFAULT_SORT_BY;
    let effectiveSortOrder = sortOrder;
    if (sortOrder === null) {
      effectiveSortBy = DEFAULT_SORT_BY;
      effectiveSortOrder = DEFAULT_SORT_ORDER;
    }

    if (effectiveSortOrder && effectiveSortBy) {
      params.sort = `${effectiveSortBy}:${effectiveSortOrder}`;
    }
    return params;
  }, [currentPage, pageSize, selectedBreeds, sortBy, sortOrder]);

  const {
    dogs,
    total,
    isLoading: loading,
    error,
  } = useDogApiSearch(searchParams);

  return {
    dogs,
    loading,
    error,
    totalDogs: total,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  };
}
