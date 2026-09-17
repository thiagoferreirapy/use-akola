export type Db = {
  users: Array<{ id: string; name: string; email: string; phone?: string; passwordHash: string; role: 'USER' | 'BUSINESS' | 'ADMIN'; reputationScore: number; createdAt: string }>;
  places: Array<Record<string, unknown> & { id: string; name: string; createdByUserId?: string; status: string; partnerTier: string }>;
  confirmations: Array<Record<string, unknown> & { id: string; placeId: string; userId: string }>;
  reviews: Array<Record<string, unknown> & { id: string; placeId: string; userId: string }>;
  favorites: Array<{ id: string; userId: string; placeId: string; createdAt: string }>;
  claims: Array<Record<string, unknown> & { id: string; placeId: string; userId: string; status: string }>;
  offers: Array<Record<string, unknown> & { id: string; placeId: string; status: string }>;
  visits: Array<Record<string, unknown> & { id: string; placeId: string; userId: string }>;
  redemptions: Array<Record<string, unknown> & { id: string; offerId: string; userId: string }>;
  reports: Array<Record<string, unknown> & { id: string; placeId: string; userId: string; status: string }>;
};
