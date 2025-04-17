import React from 'react';
import { Layout, Row, Col, Typography, Space, Button, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Match from './match';
import styles from '../SearchPage.module.css';

const { Header } = Layout;
const { Title } = Typography;

interface SearchHeaderProps {
  favoritedDogs: Set<string>;
  toggleFavorite: (dogId: string) => void;
  logout: () => Promise<void>;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  favoritedDogs,
  toggleFavorite,
  logout,
}) => {
  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully.');
    } catch (err) {
      message.error('Logout failed. Please try again.');
    }
  };

  return (
    <Header className={styles.searchPageHeader}>
      {/* Removed inline style from Row */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} className={styles.headerTitle}>
            Find Your New Companion
          </Title>
        </Col>
        <Col>
          <Space align="center" size="middle">
            <Match
              favoritedDogs={favoritedDogs}
              toggleFavorite={toggleFavorite}
            />
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default SearchHeader;
