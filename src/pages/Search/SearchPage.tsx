import React, { useState } from 'react';
import { Layout } from 'antd';
import FilterControls from './components/FilterControls';
import SearchHeader from './components/SearchHeader';
import SearchResults from './components/SearchResults';
import { useAuth } from '../../contexts/AuthContext';
import { useDogSearch } from '../../hooks/useDogSearch';
import { useBreeds } from '../../hooks/useBreeds';
import { useFavorites } from '../../hooks/useFavorites';
import styles from './SearchPage.module.css';
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from '../../constants';

const { Content } = Layout;

const SearchPage: React.FC = () => {
  const { logout } = useAuth();
  const { breeds } = useBreeds();
  const [favoritedDogs, toggleFavorite] = useFavorites();
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string | null>(DEFAULT_SORT_ORDER);
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_BY);

  const {
    dogs,
    loading,
    error,
    totalDogs,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  } = useDogSearch(selectedBreeds, sortBy, sortOrder);

  const handleBreedChange = (values: string[]) => {
    setSelectedBreeds(values);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, size: number) => {
    if (size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleSortChange = (key: string) => {
    let newSortOrder: string | null = 'asc';
    if (sortBy === key) {
      if (sortOrder === 'asc') {
        newSortOrder = 'desc';
      } else if (sortOrder === 'desc') {
        newSortOrder = null;
      } else {
        newSortOrder = 'asc';
      }
    }
    setSortBy(key);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  return (
    <Layout className={styles.searchPageLayout}>
      <SearchHeader
        favoritedDogs={favoritedDogs}
        toggleFavorite={toggleFavorite}
        logout={logout}
      />
      <Content className={styles.searchPageContent}>
        <FilterControls
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onBreedChange={handleBreedChange}
          onSortChange={handleSortChange}
        />

        <SearchResults
          dogs={dogs}
          loading={loading}
          error={error}
          totalDogs={totalDogs}
          currentPage={currentPage}
          pageSize={pageSize}
          handlePageChange={handlePageChange}
          favoritedDogs={favoritedDogs}
          toggleFavorite={toggleFavorite}
        />
      </Content>
    </Layout>
  );
};

export default SearchPage;
