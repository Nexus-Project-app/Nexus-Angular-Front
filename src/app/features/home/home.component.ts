import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostsService } from '../../infrastructure/services/posts.service';
import { PostDto } from '../posts/models/post.model';
import { NavbarComponent } from '../../shared/components/navbar.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="min-h-screen bg-nexus-bg">
      <!-- Feed -->
      <section class="max-w-4xl mx-auto px-4 py-8">
        <div class="space-y-6">
          <div *ngIf="feedPosts().length === 0" class="text-center py-12">
            <p class="text-nexus-muted text-sm">Aucun post disponible pour le moment</p>
          </div>

          <article
            *ngFor="let post of feedPosts()"
            class="bg-nexus-card border border-nexus-border rounded-lg p-6 cursor-pointer hover:border-nexus-accent hover:shadow-md transition-all"
            (click)="openPost(post.id)"
          >
            <div class="space-y-3">
              <h2 class="text-lg font-semibold text-nexus-text">{{ post.title }}</h2>
              <p class="text-sm text-nexus-muted line-clamp-3">{{ getExcerpt(post.content) }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-nexus-muted">{{ formatDate(post.created) }}</span>
                <span *ngIf="post.tags.length > 0" class="text-xs text-nexus-accent">
                  {{ post.tags.join(', ') }}
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-4 mt-8">
          <button
            *ngIf="currentPage() > 1"
            (click)="previousPage()"
            class="px-4 py-2 border border-nexus-border rounded-lg text-sm text-nexus-text hover:bg-nexus-card transition-colors"
          >
            ← Précédent
          </button>
          <span class="text-sm text-nexus-muted">
            Page {{ currentPage() }} / {{ totalPages() }}
          </span>
          <button
            *ngIf="hasNextPage()"
            (click)="nextPage()"
            class="px-4 py-2 border border-nexus-border rounded-lg text-sm text-nexus-text hover:bg-nexus-card transition-colors"
          >
            Suivant →
          </button>
        </div>
      </section>
    </main>
  `,
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);

  protected readonly feedPosts = signal<ReadonlyArray<PostDto>>([]);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly totalCount = signal(0);

  protected readonly hasNextPage = signal(false);
  protected readonly totalPages = signal(1);

  constructor() {
    this.loadFeed();
  }

  protected loadFeed(page = 1): void {
    this.postsService.listPosts(page, this.pageSize()).subscribe({
      next: (response) => {
        this.feedPosts.set(response.items);
        this.currentPage.set(response.page);
        this.totalCount.set(response.totalCount);
        this.hasNextPage.set(response.hasNextPage);
        this.totalPages.set(Math.ceil(response.totalCount / this.pageSize()));
      },
      error: (error: Error) => console.error('Failed to load posts', error),
    });
  }

  protected nextPage(): void {
    const next = this.currentPage() + 1;
    this.loadFeed(next);
  }

  protected previousPage(): void {
    const prev = Math.max(1, this.currentPage() - 1);
    this.loadFeed(prev);
  }

  protected openPost(id: string): void {
    void this.router.navigate(['/posts', id]);
  }

  protected getExcerpt(content: string): string {
    const normalized = content.trim();
    return normalized.length > 200 ? `${normalized.slice(0, 200)}...` : normalized;
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }
}
