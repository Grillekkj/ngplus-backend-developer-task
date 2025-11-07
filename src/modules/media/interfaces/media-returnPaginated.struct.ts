import MediaEntity from '../entities/media.entity';

export interface IReturnPaginatedMedia {
  data: MediaEntity[];
  currentPage: number;
  total: number;
}
