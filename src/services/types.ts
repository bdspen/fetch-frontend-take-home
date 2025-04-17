export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface SearchDogsParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}

export interface SearchDogsResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface MatchResponse {
  match: string;
}

export interface LoginRequest {
  name: string;
  email: string;
}
