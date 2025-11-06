import { MediaCategory } from '../enums/category.enum';

export interface IUpdateMedia {
  id: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  mediaCategory?: MediaCategory;
}
