import { MediaCategory } from '../enums/category.enum';

export interface ICreateMedia {
  title: string;
  description: string;
  thumbnailUrl?: string;
  contentUrl: string;
  mediaCategory: MediaCategory;
  userId: string;
}
