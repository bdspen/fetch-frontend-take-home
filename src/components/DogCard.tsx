import React from 'react';
import { Card, Typography, Button, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Dog } from '../services/types';
import styles from './DogCard.module.css';

const { Text, Paragraph } = Typography;

interface DogCardBaseProps {
  dog: Dog;
}

type DogCardConditionalProps =
  | {
      actionType: 'toggle';
      isFavorite: boolean;
      onToggleFavorite: (dogId: string) => void;
      onRemoveFavorite?: never;
    }
  | {
      actionType: 'remove';
      onRemoveFavorite: (dogId: string) => void;
      isFavorite?: never;
      onToggleFavorite?: never;
    }
  | {
      actionType?: never;
      isFavorite?: never;
      onToggleFavorite?: never;
      onRemoveFavorite?: never;
    };

type DogCardProps = DogCardBaseProps & DogCardConditionalProps;

const DogCard: React.FC<DogCardProps> = (props) => {
  const { dog, actionType } = props;

  let actionButton: React.ReactNode = null;

  if (actionType === 'toggle') {
    const { isFavorite, onToggleFavorite } = props;
    actionButton = (
      <Tooltip
        key={`toggle-fav-${dog.id}`}
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        <Button
          type="text"
          icon={
            isFavorite ? (
              <HeartFilled className={styles.favoriteIconFilled} />
            ) : (
              <HeartOutlined />
            )
          }
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(dog.id);
          }}
        >
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </Button>
      </Tooltip>
    );
  } else if (actionType === 'remove') {
    const { onRemoveFavorite } = props;
    actionButton = (
      <Button
        key={`remove-fav-${dog.id}`}
        type="text"
        danger
        onClick={(e) => {
          e.stopPropagation();
          onRemoveFavorite(dog.id);
        }}
        icon={<HeartFilled className={styles.favoriteIconFilled} />}
      >
        Remove Favorite
      </Button>
    );
  }

  return (
    <Card
      hoverable
      cover={<img alt={dog.name} src={dog.img} className={styles.cardImage} />}
      actions={actionButton ? [actionButton] : undefined}
    >
      <Card.Meta
        title={<Text strong>{dog.name}</Text>}
        description={
          <>
            <Paragraph>
              <strong>Breed:</strong> {dog.breed}
            </Paragraph>
            <Paragraph>
              <strong>Age:</strong> {dog.age}
            </Paragraph>
            <Paragraph>
              <strong>Zip:</strong> {dog.zip_code}
            </Paragraph>
          </>
        }
      />
    </Card>
  );
};

export default DogCard;
