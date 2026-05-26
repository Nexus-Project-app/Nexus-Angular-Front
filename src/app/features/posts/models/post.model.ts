/**
 * Post DTO - représente un post depuis l'API
 */
export interface PostDto {
  readonly id: string;
  readonly authorId: string;
  readonly title: string;
  readonly content: string;
  readonly tags: ReadonlyArray<string>;
  readonly created: string; // ISO 8601 datetime
  readonly updated: string; // ISO 8601 datetime
}

/**
 * Payload pour créer/modifier un post
 */
export interface PostPayload {
  readonly title: string;
  readonly content: string;
  readonly tags: ReadonlyArray<string>;
}

/**
 * Réponse paginée GET /posts
 */
export interface PostsListResponse {
  readonly items: ReadonlyArray<PostDto>;
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}
