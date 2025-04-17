import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Modal,
  Spin,
  Row,
  Col,
  Typography,
  Divider,
  Badge,
  Alert,
} from 'antd';
import { HeartFilled, CheckCircleOutlined } from '@ant-design/icons';
import { getDogsByIds, generateMatch } from '../../../services/api';
import { Dog, MatchResponse } from '../../../services/types';
import DogCard from '../../../components/DogCard';
import styles from './match.module.css';

const { Title } = Typography;

interface MatchProps {
  favoritedDogs: Set<string>;
  toggleFavorite: (dogId: string) => void;
}

const Match: React.FC<MatchProps> = ({ favoritedDogs, toggleFavorite }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favoriteDogsData, setFavoriteDogsData] = useState<Dog[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchedDogId, setMatchedDogId] = useState<string | null>(null);
  const [matchedDogData, setMatchedDogData] = useState<Dog | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    if (isModalVisible) {
      const fetchInitialData = async () => {
        if (favoritedDogs.size === 0) {
          setFavoriteDogsData([]);
          return;
        }
        setLoadingFavorites(true);
        setMatchError(null);
        try {
          const dogsData = await getDogsByIds(Array.from(favoritedDogs));
          setFavoriteDogsData(dogsData);
        } catch (error) {
          console.error('Error fetching favorited dogs:', error);
          setMatchError('Could not load favorite dog details.');
          setFavoriteDogsData([]);
        } finally {
          setLoadingFavorites(false);
        }
      };
      fetchInitialData();
    } else {
      setFavoriteDogsData([]);
      setMatchedDogId(null);
      setMatchedDogData(null);
      setMatchError(null);
    }
  }, [isModalVisible, favoritedDogs]);

  const fetchMatchedDogDetails = useCallback(
    async (dogId: string) => {
      if (!isModalVisible) return;
      try {
        const dogsData = await getDogsByIds([dogId]);
        if (dogsData.length > 0) {
          setMatchedDogData(dogsData[0]);
        } else {
          throw new Error('Matched dog details not found.');
        }
      } catch (error) {
        console.error('Error fetching matched dog details:', error);
        setMatchError('Could not load details for the matched dog.');
        setMatchedDogData(null);
      } finally {
        setLoadingMatch(false);
      }
    },
    [isModalVisible]
  );

  useEffect(() => {
    if (matchedDogId) {
      fetchMatchedDogDetails(matchedDogId);
    } else {
      setMatchedDogData(null);
    }
  }, [matchedDogId, fetchMatchedDogDetails]);

  const showModal = () => {
    setMatchedDogId(null);
    setMatchedDogData(null);
    setMatchError(null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleGenerateMatch = async () => {
    if (favoritedDogs.size === 0) return;

    setLoadingMatch(true);
    setMatchedDogId(null);
    setMatchedDogData(null);
    setMatchError(null);
    try {
      const response: MatchResponse = await generateMatch(
        Array.from(favoritedDogs)
      );
      setMatchedDogId(response.match);
    } catch (error) {
      console.error('Error generating match:', error);
      setMatchError(
        'An error occurred while generating your match. Please try again.'
      );
      setLoadingMatch(false);
    }
  };

  const handleRemoveFavorite = (dogId: string) => {
    toggleFavorite(dogId);

    setFavoriteDogsData((currentDogData) =>
      currentDogData.filter((dog) => dog.id !== dogId)
    );

    if (dogId === matchedDogId) {
      setMatchedDogId(null);
      setMatchedDogData(null);
    }
  };

  return (
    <>
      <Badge count={favoritedDogs.size} showZero={false}>
        <Button
          type="primary"
          onClick={showModal}
          icon={<HeartFilled />}
        >
          Favorites & Match
        </Button>
      </Badge>

      <Modal
        title={
          <div className={styles.modalTitle}>
            <HeartFilled className={styles.modalTitleIcon} />
            <span>Your Favorite Dogs</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        {loadingFavorites ? (
          <div className={styles.loadingContainer}>
            <Spin tip="Loading your favorites..." size="large" />
          </div>
        ) : matchError && !loadingMatch ? (
          <Alert
            message="Error"
            description={matchError}
            type="error"
            showIcon
            className={styles.errorAlert}
          />
        ) : (
          <>
            {loadingMatch && (
              <div className={styles.matchLoadingContainer}>
                <Spin tip="Finding your match..." size="large" />
              </div>
            )}

            {matchedDogData && !loadingMatch && (
              <div className={styles.matchResultContainer}>
                <Title level={3} className={styles.matchResultTitle}>
                  <CheckCircleOutlined className={styles.matchResultIcon} />
                  You've Been Matched! {/* Escaped apostrophe */}
                </Title>
                <div className={styles.matchDetailsContainer}>
                  <DogCard dog={matchedDogData} />
                </div>
              </div>
            )}

            {matchError && !loadingMatch && !matchedDogData && (
              <Alert
                message="Match Error"
                description={matchError}
                type="error"
                showIcon
                className={styles.errorAlert}
              />
            )}

            <Title level={4}>Your Favorites ({favoriteDogsData.length})</Title>
            {favoriteDogsData.length > 0 ? (
              <div className={styles.favoritesListContainer}>
                <Row gutter={[16, 16]}>
                  {favoriteDogsData.map((dog) => (
                    <Col xs={24} sm={12} md={8} key={dog.id}>
                      <DogCard
                        actionType="remove"
                        dog={dog}
                        onRemoveFavorite={handleRemoveFavorite}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              !loadingFavorites && (
                <Alert
                  message="No Favorites Yet"
                  description="Add dogs to your favorites list from the search page."
                  type="info"
                  showIcon
                  className={styles.noFavoritesAlert}
                />
              )
            )}

            <Divider />
            <div className={styles.modalFooter}>
              <Button
                type="primary"
                size="large"
                onClick={handleGenerateMatch}
                disabled={
                  favoriteDogsData.length === 0 ||
                  loadingMatch ||
                  loadingFavorites
                }
                loading={loadingMatch}
                icon={<CheckCircleOutlined />}
              >
                {matchedDogId ? 'Generate New Match' : 'Generate Match'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default Match;
