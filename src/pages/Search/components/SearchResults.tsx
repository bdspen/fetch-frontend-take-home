import React from 'react';
import { Spin, Alert, Typography, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DogList from './DogList';
import { Dog } from '../../../services/types';
import { PAGE_SIZE_OPTIONS } from '../../../constants';
import styles from '../SearchPage.module.css';

const { Title, Paragraph } = Typography;

interface SearchResultsProps {
  dogs: Dog[];
  loading: boolean;
  error: string | null;
  totalDogs: number;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number, size: number) => void;
  favoritedDogs: Set<string>;
  toggleFavorite: (dogId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  dogs,
  loading,
  error,
  totalDogs,
  currentPage,
  pageSize,
  handlePageChange,
  favoritedDogs,
  toggleFavorite,
}) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin tip="Fetching dogs..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  if (dogs.length === 0) {
    return (
      <div className={styles.noResultsContainer}>
        <SearchOutlined className={styles.noResultsIcon} />
        <Title level={4} className={styles.noResultsTitle}>
          No Dogs Found
        </Title>
        <Paragraph>Try adjusting your filters or search criteria.</Paragraph>
      </div>
    );
  }

  return (
    <>
      <DogList
        dogs={dogs}
        favoritedDogs={favoritedDogs}
        toggleFavorite={toggleFavorite}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalDogs}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        className={styles.paginationContainer}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} dogs`
        }
      />
    </>
  );
};

export default SearchResults;
