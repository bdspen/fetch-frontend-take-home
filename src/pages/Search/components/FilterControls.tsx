import React from 'react';
import { Select, Button, Dropdown, Card, Row, Col } from 'antd';
import {
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';

interface FilterControlsProps {
  breeds: string[];
  selectedBreeds: string[];
  sortBy: string;
  sortOrder: string | null;
  onBreedChange: (values: string[]) => void;
  onSortChange: (key: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  breeds,
  selectedBreeds,
  sortBy,
  sortOrder,
  onBreedChange,
  onSortChange,
}) => {
  const getSortIcon = (key: string) => {
    if (sortBy !== key || sortOrder === null) return null;
    if (sortOrder === 'asc') return <SortAscendingOutlined />;
    if (sortOrder === 'desc') return <SortDescendingOutlined />;
    return null;
  };

  const sortMenuItems = [
    { key: 'breed', label: <span>Breed {getSortIcon('breed')}</span> },
    { key: 'age', label: <span>Age {getSortIcon('age')}</span> },
    { key: 'name', label: <span>Name {getSortIcon('name')}</span> },
  ];

  return (
    <Card title="Filter & Sort" style={{ marginBottom: 24 }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col flex="auto">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Filter by breeds..."
            value={selectedBreeds}
            onChange={onBreedChange}
            options={breeds.map((breed) => ({ label: breed, value: breed }))}
            maxTagCount="responsive"
            loading={breeds.length === 0}
          />
        </Col>
        <Col>
          <Dropdown
            menu={{
              items: sortMenuItems,
              onClick: ({ key }) => onSortChange(key),
            }}
            placement="bottomRight"
          >
            <Button icon={<FilterOutlined />}>
              Sort By: {sortBy} {getSortIcon(sortBy)}
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Card>
  );
};

export default FilterControls;
