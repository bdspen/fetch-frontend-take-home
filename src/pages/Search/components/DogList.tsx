import React from 'react';
import { Row, Col } from 'antd';
import { Dog } from '../../../services/types';
import DogCard from '../../../components/DogCard';

interface DogListProps {
  dogs: Dog[];
  favoritedDogs: Set<string>;
  toggleFavorite: (dogId: string) => void;
}

const DogList: React.FC<DogListProps> = ({
  dogs,
  favoritedDogs,
  toggleFavorite,
}) => {
  return (
    <Row gutter={[24, 24]}>
      {dogs.map((dog) => (
        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4} key={dog.id}>
          <DogCard
            actionType="toggle"
            dog={dog}
            isFavorite={favoritedDogs.has(dog.id)}
            onToggleFavorite={toggleFavorite}
          />
        </Col>
      ))}
    </Row>
  );
};

export default DogList;
