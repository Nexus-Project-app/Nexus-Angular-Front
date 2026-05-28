/**
 * Comment DTO - représente un commentaire depuis l'API
 */
export interface CommentDto {
  readonly id: string;
  readonly authorId: string;
  readonly content: string;
  readonly created: string; // ISO 8601 datetime
  readonly updated: string; // ISO 8601 datetime
}

/**
 * Réponse paginée GET /posts/:id/comments
 */
export interface CommentPagedResponse {
  readonly items: ReadonlyArray<CommentDto>;
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}
