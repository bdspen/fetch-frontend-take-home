import axios from 'axios';
import {
  Dog,
  LoginRequest,
  MatchResponse,
  SearchDogsParams,
  SearchDogsResponse,
} from './types';

const API_BASE_URL =
  import.meta.env.VITE_FETCH_API_BASE_URL ||
  'https://frontend-take-home-service.fetch.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Authenticate a user
 * Hits the standard Fetch API login endpoint.
 * Expects a 200 OK response with the auth cookie set in headers.
 */
export const login = async (name: string, email: string): Promise<void> => {
  await apiClient.post('/auth/login', { name, email } as LoginRequest);
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * Get all available dog breeds
 */
export const getBreeds = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/dogs/breeds');
  return response.data;
};

/**
 * Search for dogs using API
 */
export const searchDogs = async (
  params: SearchDogsParams
): Promise<SearchDogsResponse> => {
  const response = await apiClient.get<SearchDogsResponse>('/dogs/search', {
    params,
  });
  return response.data;
};

/**
 * Get dogs by IDs
 */
export const getDogsByIds = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await apiClient.post<Dog[]>('/dogs', dogIds);
  return response.data;
};

/**
 * Generate a match using API
 */
export const generateMatch = async (
  dogIds: string[]
): Promise<MatchResponse> => {
  const response = await apiClient.post<MatchResponse>('/dogs/match', dogIds);
  return response.data;
};
