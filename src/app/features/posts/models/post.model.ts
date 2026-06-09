/**
 * Post DTO - représente un post depuis l'API
 */
export interface PostDto {
  readonly id: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly title: string;
  readonly content: string;
  readonly tags: ReadonlyArray<string>;
  readonly created: string; // ISO 8601 datetime
  readonly updated: string; // ISO 8601 datetime
  readonly likeCount: number;
  readonly commentCount: number;
  readonly isLikedByCurrentUser: boolean;
  readonly groupId: string | null;
  readonly groupName: string | null;
}

/**
 * Réponse du toggle like
 */
export interface ToggleLikeResponse {
  readonly isLiked: boolean;
  readonly likeCount: number;
}

/**
 * Payload pour créer/modifier un post
 */
export interface PostPayload {
  readonly title: string;
  readonly content: string;
  readonly tags: ReadonlyArray<string>;
  readonly groupId?: string | null;
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
