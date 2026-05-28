import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar.component';
import { PostsService } from '../../../infrastructure/services/posts.service';
import { LikesService } from '../../../infrastructure/services/likes.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { PostDto } from '../models/post.model';
import { CommentsSectionComponent } from './comments-section.component';

@Component({
  selector: 'app-post-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NavbarComponent, CommentsSectionComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="post-view-main">
      <div *ngIf="!post()" class="post-loading">
        <p>Chargement du post...</p>
      </div>

      <article *ngIf="post()" class="post-article">
        <div class="post-card">
          <!-- Header : titre + actions owner -->
          <div class="post-header">
            <h1 class="post-title">{{ post()!.title }}</h1>
            <div class="post-meta-row">
              <span class="post-date">{{ formatDate(post()!.created) }}</span>
              <div class="post-owner-actions">
                <button *ngIf="isOwner()" (click)="editPost()" class="btn-outline">Modifier</button>
                <button *ngIf="isOwner()" (click)="deletePost()" class="btn-danger">Supprimer</button>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div *ngIf="post()!.tags.length > 0" class="post-tags">
            <span *ngFor="let tag of post()!.tags" class="post-tag">{{ tag }}</span>
          </div>

          <!-- Contenu -->
          <div class="post-content">{{ post()!.content }}</div>

          <!-- Like bar -->
          <div class="post-like-bar">
            <button
              class="like-btn"
              [class.like-btn--active]="likedState()"
              [disabled]="!isConnected() || likeLoading()"
              (click)="toggleLike()"
              [title]="isConnected() ? (likedState() ? 'Ne plus aimer' : 'Aimer') : 'Connectez-vous pour liker'"
            >
              <svg class="like-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  *ngIf="!likedState()"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="none" stroke="currentColor" stroke-width="2"
                />
                <path
                  *ngIf="likedState()"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                />
              </svg>
              <span class="like-count">{{ likeCount() }}</span>
            </button>

            <span class="comment-count-display">
              <svg viewBox="0 0 24 24" class="comment-icon" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ post()!.commentCount }}</span>
            </span>
          </div>
        </div>

        <!-- Séparateur -->
        <hr class="post-divider" />

        <!-- Commentaires -->
        <app-comments-section
          [postId]="post()!.id"
          [currentUserId]="currentUserId()"
        />
      </article>
    </main>
  `,
  styles: `
    .post-view-main {
      background: var(--nexus-bg);
      min-height: 100dvh;
      padding: 2rem 1rem 3rem;
    }

    .post-loading {
      max-width: 56rem;
      margin: 0 auto;
      text-align: center;
      color: var(--nexus-text-secondary);
    }

    .post-article {
      max-width: 56rem;
      margin: 0 auto;
    }

    .post-card {
      background: var(--nexus-bg-component);
      border: 1px solid var(--nexus-border);
      border-radius: 1rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .post-header {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .post-title {
      color: var(--nexus-text-primary);
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }

    .post-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .post-date {
      color: var(--nexus-text-secondary);
      font-size: 0.875rem;
    }

    .post-owner-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--nexus-interaction);
      border-radius: 0.5rem;
      color: var(--nexus-interaction);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.875rem;
      padding: 0.4rem 1rem;
      transition: all 0.2s ease;
    }

    .btn-outline:hover {
      background: var(--nexus-interaction);
      color: #fff;
    }

    .btn-danger {
      background: transparent;
      border: 1px solid #ef4444;
      border-radius: 0.5rem;
      color: #ef4444;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.875rem;
      padding: 0.4rem 1rem;
      transition: all 0.2s ease;
    }

    .btn-danger:hover {
      background: #ef4444;
      color: #fff;
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .post-tag {
      background: color-mix(in srgb, var(--nexus-interaction) 12%, transparent);
      border-radius: 999px;
      color: var(--nexus-interaction);
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
    }

    .post-content {
      color: var(--nexus-text-primary);
      font-size: 1rem;
      line-height: 1.7;
      white-space: pre-wrap;
    }

    .post-like-bar {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--nexus-border);
    }

    .like-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: transparent;
      border: 0;
      color: var(--nexus-text-secondary);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9rem;
      padding: 0.3rem 0.5rem;
      border-radius: 0.5rem;
      transition: color 0.2s ease, background 0.2s ease;
    }

    .like-btn:hover:not(:disabled) {
      color: #f43f5e;
      background: color-mix(in srgb, #f43f5e 10%, transparent);
    }

    .like-btn--active {
      color: #f43f5e !important;
    }

    .like-btn:disabled {
      cursor: default;
      opacity: 0.6;
    }

    .like-icon {
      width: 1.2rem;
      height: 1.2rem;
    }

    .like-count {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .comment-count-display {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--nexus-text-secondary);
      font-size: 0.875rem;
    }

    .comment-icon {
      width: 1.1rem;
      height: 1.1rem;
    }

    .post-divider {
      border: none;
      border-top: 1px solid var(--nexus-border);
      margin: 2rem 0;
    }
  `,
})
export class PostViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);
  private readonly likesService = inject(LikesService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  protected readonly post = signal<PostDto | null>(null);
  protected readonly currentUserId = signal<string | null>(null);
  protected readonly isConnected = signal(this.authService.instance?.authenticated ?? false);

  protected readonly likedState = signal(false);
  protected readonly likeCount = signal(0);
  protected readonly likeLoading = signal(false);

  protected readonly isOwner = computed(() => {
    const p = this.post();
    const uid = this.currentUserId();
    return Boolean(p && uid && p.authorId === uid);
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.postsService.getPostById(id).subscribe({
        next: (post) => {
          this.post.set(post);
          this.likedState.set(post.isLikedByCurrentUser);
          this.likeCount.set(post.likeCount);
        },
        error: (error: Error) => console.error('[PostView] Failed to load post:', error),
      });
    }

    const userObs = this.userService.getCurrentUser();
    if (userObs) {
      userObs.subscribe({
        next: (user) => this.currentUserId.set(user.id),
        error: (err: Error) => console.error('[PostView] /users/me failed:', err),
      });
    }
  }

  protected toggleLike(): void {
    const currentPost = this.post();
    if (!currentPost || this.likeLoading()) return;

    const wasLiked = this.likedState();
    this.likedState.set(!wasLiked);
    this.likeCount.update(c => wasLiked ? c - 1 : c + 1);
    this.likeLoading.set(true);

    this.likesService.toggleLike(currentPost.id).subscribe({
      next: (res) => {
        this.likedState.set(res.isLiked);
        this.likeCount.set(res.likeCount);
        this.likeLoading.set(false);
      },
      error: (err: Error) => {
        this.likedState.set(wasLiked);
        this.likeCount.update(c => wasLiked ? c + 1 : c - 1);
        this.likeLoading.set(false);
        console.error('[PostView] Failed to toggle like:', err);
      },
    });
  }

  protected editPost(): void {
    const p = this.post();
    if (!p) return;
    this.router.navigate(['/editor'], { queryParams: { id: p.id, title: p.title } });
  }

  protected deletePost(): void {
    const p = this.post();
    if (!p) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;
    this.postsService.deletePost(p.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error: Error) => console.error('Failed to delete post', error),
    });
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  }
}
