export type TrustState =
  | 'partner'
  | 'recent'
  | 'community'
  | 'old'
  | 'unavailable';

export type ServiceType = 'toilet' | 'water' | 'accessible' | 'changing';

export type Place = {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  walkMinutes: number;
  openNow: boolean;
  rating: number;
  address: string;
  access: string;
  services: ServiceType[];
  trustState: TrustState;
  lastConfirmed: string;
  partner: boolean;
  description: string;
};
