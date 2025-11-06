import RatingEntity from '../entities/rating.entity';

export interface IReturnPaginatedRatings {
  data: RatingEntity[];
  currentPage: number;
  total: number;
}
