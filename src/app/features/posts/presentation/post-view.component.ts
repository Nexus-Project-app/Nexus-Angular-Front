import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar.component';
import { PostsService } from '../../../infrastructure/services/posts.service';
import { UserService } from '../../../shared/services/user.service';
import { PostDto } from '../models/post.model';

@Component({
  selector: 'app-post-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="min-h-screen bg-nexus-bg py-8">
      <div *ngIf="!post()" class="max-w-4xl mx-auto px-4">
        <p class="text-nexus-muted text-center">Chargement du post...</p>
      </div>

      <article *ngIf="post()" class="max-w-4xl mx-auto px-4">
        <div class="bg-nexus-card border border-nexus-border rounded-lg p-8 space-y-6">
          <!-- Header with title and actions -->
          <div class="space-y-4">
            <h1 class="text-3xl font-bold text-nexus-text">{{ post()!.title }}</h1>
            <div class="flex items-center justify-between">
              <div class="text-sm text-nexus-muted">
                {{ formatDate(post()!.created) }}
              </div>
              <div class="flex gap-2">
                <button
                  *ngIf="isOwner()"
                  (click)="editPost()"
                  class="px-4 py-2 border border-nexus-accent text-nexus-accent rounded-lg text-sm hover:bg-nexus-accent hover:text-nexus-bg transition-colors"
                >
                  Modifier
                </button>
                <button
                  *ngIf="isOwner()"
                  (click)="deletePost()"
                  class="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-500 hover:text-white transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div *ngIf="post()!.tags.length > 0" class="flex flex-wrap gap-2">
            <span
              *ngFor="let tag of post()!.tags"
              class="px-3 py-1 bg-nexus-accent/10 text-nexus-accent rounded-full text-xs"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Content -->
          <div class="prose prose-invert max-w-none text-nexus-text">
            {{ post()!.content }}
          </div>
        </div>
      </article>
    </main>
  `,
})
export class PostViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);

  protected readonly post = signal<PostDto | null>(null);
  // Id réel de la DB (retourné par /users/me via IUserContext côté back)
  protected readonly currentUserId = signal<string | null>(null);

  protected readonly isOwner = computed(() => {
    const currentPost = this.post();
    const userId = this.currentUserId();

    return Boolean(currentPost && userId && currentPost.authorId === userId);
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.postsService.getPostById(id).subscribe({
        next: (post) => {
          this.post.set(post);
        },
        error: (error: Error) => console.error('[PostView] Failed to load post:', error),
      });
    }

    // /users/me retourne maintenant l'Id DB réel (via IUserContext côté back),
    // compatible avec Post.AuthorId quelle que soit l'ancienneté du compte.
    const userObs = this.userService.getCurrentUser();
    if (userObs) {
      userObs.subscribe({
        next: (user) => {
          this.currentUserId.set(user.id);
        },
        error: (err: Error) => console.error('[PostView] /users/me failed:', err),
      });
    } else {
      // SSR : pas de userService côté serveur, on laisse currentUserId à null
    }
  }

  protected editPost(): void {
    const currentPost = this.post();
    if (!currentPost) {
      return;
    }
    void this.router.navigate(['/editor'], {
      queryParams: { id: currentPost.id, title: currentPost.title },
    });
  }

  protected deletePost(): void {
    const currentPost = this.post();
    if (!currentPost) {
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      return;
    }

    this.postsService.deletePost(currentPost.id).subscribe({
      next: () => void this.router.navigate(['/']),
      error: (error: Error) => console.error('Failed to delete post', error),
    });
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }
}
