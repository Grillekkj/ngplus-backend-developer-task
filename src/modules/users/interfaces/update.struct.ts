export interface IUpdate {
  id: string;
  profilePictureUrl?: string;
  username?: string;
  email?: string;
  refreshTokenHash?: string | null;
  ratingCount?: number;
  lastLogin?: Date | null;
}
