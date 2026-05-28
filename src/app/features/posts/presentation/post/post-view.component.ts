import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { MarkdownRendererComponent } from '@shared/components/markdown-renderer/markdown-renderer.component';
import { PostsService } from '@shared/services/posts.service';
import { LikesService } from '@shared/services/likes.service';
import { UserService } from '@shared/services/user.service';
import { AuthService } from '@shared/services/auth.service';
import { formatDate } from '@shared/utils/format-date';
import { PostDto } from '../../models/post.model';
import { CommentsSectionComponent } from '../comments/comments-section.component';

@Component({
  selector: 'app-post-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, NavbarComponent, CommentsSectionComponent, MarkdownRendererComponent],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.css',
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
    if (!currentPost || this.likeLoading()) {
      return;
    }

    const wasLiked = this.likedState();
    this.likedState.set(!wasLiked);
    this.likeCount.update((count) => (wasLiked ? count - 1 : count + 1));
    this.likeLoading.set(true);

    this.likesService.toggleLike(currentPost.id).subscribe({
      next: (res) => {
        this.likedState.set(res.isLiked);
        this.likeCount.set(res.likeCount);
        this.likeLoading.set(false);
      },
      error: (err: Error) => {
        this.likedState.set(wasLiked);
        this.likeCount.update((count) => (wasLiked ? count + 1 : count - 1));
        this.likeLoading.set(false);
        console.error('[PostView] Failed to toggle like:', err);
      },
    });
  }

  protected editPost(): void {
    const p = this.post();
    if (!p) {
      return;
    }
    void this.router.navigate(['/editor'], { queryParams: { id: p.id, title: p.title } });
  }

  protected deletePost(): void {
    const p = this.post();
    if (!p) {
      return;
    }
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      return;
    }
    this.postsService.deletePost(p.id).subscribe({
      next: () => {
        void this.router.navigate(['/']);
      },
      error: (error: Error) => console.error('Failed to delete post', error),
    });
  }

  protected readonly formatDateFn = formatDate;

  protected goBack(): void {
    void this.router.navigate(['/']);
  }
}
