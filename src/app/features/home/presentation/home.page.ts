import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreateDocumentationComponent } from './create-documentation.component';
import { DiscoveryItemComponent } from './discovery-item.component';
import { FooterLinksComponent } from './footer-links.component';
import { NavbarComponent } from '@shared/components/navbar.component';
import { AuthService } from '@shared/services/auth.service';
import { PostsService } from '@shared/services/posts.service';
import { LikesService } from '@shared/services/likes.service';
import { PostDto } from '../../posts/models/post.model';

export interface UserProfile {
  readonly name: string;
  readonly role: string;
}

export interface SidebarItem {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
}

export interface FeedCard {
  readonly id: string;
  readonly author: string;
  readonly title: string;
  readonly description: string;
  readonly tags: ReadonlyArray<string>;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

// Import DiscoveryItem from its module
type DiscoveryItem = import('./discovery-item.component').DiscoveryItem;

const SIDEBAR_ITEM_TEMPLATE: Omit<SidebarItem, 'id'> = {
  title: 'Lorum ispeum',
  subtitle: '',
};

function createSidebarItem(id: string): SidebarItem {
  return { id, ...SIDEBAR_ITEM_TEMPLATE };
}

function createSidebarItems(ids: ReadonlyArray<string>): ReadonlyArray<SidebarItem> {
  return ids.map((id) => createSidebarItem(id));
}

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CreateDocumentationComponent,
    DiscoveryItemComponent,
    FooterLinksComponent,
    NavbarComponent,
  ],
  template: `
    <a class="skip-link" href="#main-content">Aller au contenu principal</a>
    <div class="home-page">
      <app-navbar />
      <main id="main-content" class="main-grid" aria-label="Contenu principal">
        <h1 class="visually-hidden">Fil principal Nexus</h1>
        <aside class="left-sidebar" aria-label="Navigation groupes">
          <nav class="sidebar-list" aria-label="Groupes">
            @for (item of sidebarItems(); track item.id) {
              <a
                class="sidebar-item"
                href="#"
                [attr.aria-label]="item.title + ' - ' + item.subtitle"
              >
                <span class="item-visual" aria-hidden="true"></span>
                <span class="sidebar-copy">
                  <span class="item-title">{{ item.title }}</span>
                  <span class="item-subtitle">{{ item.subtitle }}</span>
                </span>
              </a>
            }
          </nav>
          <div class="sidebar-footer">
            <button class="join-button" type="button">Rejoindre un groupe</button>
            <button class="plus-button" type="button" aria-label="Creer un groupe">+</button>
          </div>
        </aside>

        <section class="feed-column" aria-label="Fil d actualites">
          @if (isConnected()) {
            <app-create-documentation (created)="openEditor($event)" />
          }

          @for (card of feedCards(); track card.id) {
            <article
              class="feed-card"
              aria-label="Publication de {{ card.author }}"
              (click)="navigateToPost(card.id)"
              style="cursor: pointer;"
            >
              <header class="card-head">
                <div class="card-author">
                  <div class="avatar" aria-hidden="true">
                    {{ card.author.charAt(0).toUpperCase() }}
                  </div>
                  <div class="card-author-info">
                    <p class="user-name">{{ card.author }}</p>
                    <p class="card-meta">Il y a 7h</p>
                  </div>
                </div>
              </header>
              <h2 class="card-title">{{ card.title }}</h2>
              <p class="card-description">{{ card.description }}</p>
              <div class="tag-list" aria-label="Tags de la publication">
                @for (tag of card.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>
              <div class="card-actions">
                <div class="card-actions-left">
                  <!-- Bouton like -->
                  <button
                    class="action-button"
                    [class.action-button--liked]="card.isLiked"
                    type="button"
                    [attr.aria-label]="card.isLiked ? 'Ne plus aimer' : 'Aimer'"
                    [disabled]="!isConnected()"
                    (click)="toggleLike(card, $event)"
                  >
                    <svg class="action-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        *ngIf="!card.isLiked"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill="none" stroke="currentColor" stroke-width="2"
                      />
                      <path
                        *ngIf="card.isLiked"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill="currentColor"
                      />
                    </svg>
                    <span class="action-count">{{ card.likeCount }}</span>
                  </button>

                  <!-- Compteur commentaires -->
                  <span class="action-button action-button--static">
                    <svg class="action-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"
                      />
                    </svg>
                    <span class="action-count">{{ card.commentCount }}</span>
                  </span>
                </div>
              </div>
            </article>
          }

          @if (hasPreviousPage() || hasNextPage()) {
            <nav class="feed-pagination" aria-label="Navigation des pages">
              <button
                class="pagination-btn"
                type="button"
                [disabled]="!hasPreviousPage()"
                (click)="previousPage()"
                aria-label="Page précédente"
              >
                ← Précédent
              </button>
              <span class="pagination-info">Page {{ currentPage() }}</span>
              <button
                class="pagination-btn"
                type="button"
                [disabled]="!hasNextPage()"
                (click)="nextPage()"
                aria-label="Page suivante"
              >
                Suivant →
              </button>
            </nav>
          }
        </section>

        <aside class="right-sidebar" aria-label="Decouverte et informations">
          <app-discovery-item [title]="'Découverte de Sujets'" [items]="topicDiscoveries()" />
          <app-discovery-item [title]="'Découverte de groupes'" [items]="groupDiscoveries()" />
          <app-footer-links />
        </aside>
      </main>
    </div>
  `,
  styles: `
    .home-page {
      background: var(--nexus-bg);
      min-height: 100%;
    }
    .main-grid {
      display: grid;
      gap: 0.875rem;
      grid-template-columns: 360px minmax(0, 1fr) 360px;
      padding: 0.875rem;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      justify-content: center;
    }
    .left-sidebar,
    .right-sidebar {
      border-radius: 1rem;
      padding: 1rem;
      height: 100%;
      overflow: hidden;
    }
    .left-sidebar {
      background: var(--nexus-bg-component);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 0.75rem;
    }
    .sidebar-list {
      display: grid;
      gap: 0.6rem;
    }
    .right-sidebar {
      background: transparent;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .sidebar-item {
      align-items: center;
      background: var(--nexus-surface-raised);
      border: 1px solid transparent;
      border-radius: 0.75rem;
      color: var(--nexus-text-primary);
      display: flex;
      gap: 0.75rem;
      padding: 0.65rem;
      text-decoration: none;
    }
    .item-visual {
      background: var(--nexus-border-subtle);
      border: 1px solid var(--nexus-border);
      border-radius: 0.5rem;
      flex: 0 0 2rem;
      height: 2rem;
    }
    .sidebar-copy {
      display: grid;
      min-width: 0;
    }
    .item-title {
      color: var(--nexus-text-primary);
      font-weight: 600;
    }
    .item-subtitle {
      color: var(--nexus-text-secondary);
      font-size: 0.85rem;
      margin-top: 0.2rem;
    }
    .sidebar-footer {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }
    .join-button {
      background: var(--nexus-surface-raised);
      border: 1px solid var(--nexus-border);
      color: var(--nexus-text-primary);
      cursor: pointer;
      font-weight: 700;
      transition: all 0.2s ease;
      flex: 1;
      min-height: 2.5rem;
      padding: 0 1rem;
      border-radius: 999px;
    }
    .plus-button {
      background: linear-gradient(135deg, #b374ff, #076eff);
      border: none;
      border-radius: 999px;
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 2.5rem;
      min-width: 2.5rem;
      font-size: 1.2rem;
      font-weight: bold;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .feed-column {
      display: grid;
      gap: 1rem;
      min-height: 0;
      overflow-y: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
      padding-right: 0.25rem;
      align-content: start;
    }
    .feed-column::-webkit-scrollbar {
      display: none;
    }
    .feed-card {
      background: var(--nexus-bg-component);
      border: 1px solid var(--nexus-border);
      border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 1rem;
      transition: all 0.2s ease;
    }
    .card-head,
    .card-author {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }
    .card-author {
      gap: 0.75rem;
      justify-content: flex-start;
    }
    .avatar {
      align-items: center;
      background: var(--nexus-text-secondary);
      border-radius: 999px;
      color: #0a0a0f;
      display: inline-flex;
      flex: 0 0 2.25rem;
      font-size: 0.9rem;
      font-weight: 700;
      height: 2.25rem;
      justify-content: center;
      width: 2.25rem;
    }
    .card-author-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .user-name {
      color: var(--nexus-text-primary);
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .card-meta {
      color: var(--nexus-text-secondary);
      font-size: 0.78rem;
      margin: 0;
    }
    .card-title {
      color: var(--nexus-text-primary);
      font-size: 1.1rem;
      margin: 1rem 0 0.6rem;
    }
    .card-description {
      color: var(--nexus-text-secondary);
      margin: 0;
    }
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.875rem;
    }
    .tag {
      background: var(--nexus-surface-raised);
      border-radius: 999px;
      color: var(--nexus-text-primary);
      font-size: 0.8rem;
      padding: 0.3rem 0.6rem;
    }
    .card-actions {
      align-items: center;
      display: flex;
      justify-content: flex-start;
      gap: 0.75rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--nexus-border);
    }
    .card-actions-left {
      align-items: center;
      display: flex;
      gap: 0.65rem;
    }
    .action-button {
      align-items: center;
      background: transparent;
      border: 0;
      color: var(--nexus-text-secondary);
      cursor: pointer;
      display: inline-flex;
      gap: 0.35rem;
      padding: 0.3rem 0.5rem;
      border-radius: 0.5rem;
      font-family: inherit;
      font-size: 0.875rem;
      transition: color 0.2s ease, background 0.2s ease;
    }
    .action-button--static {
      cursor: default;
    }
    .action-button:not(:disabled):not(.action-button--static):hover {
      color: #f43f5e;
      background: color-mix(in srgb, #f43f5e 10%, transparent);
    }
    .action-button--liked {
      color: #f43f5e !important;
    }
    .action-button:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .action-icon {
      width: 1.1rem;
      height: 1.1rem;
    }
    .action-count {
      font-size: 0.875rem;
      font-weight: 500;
    }
    .feed-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 0.75rem 0;
    }
    .pagination-btn {
      background: var(--nexus-surface-raised);
      border: 1px solid var(--nexus-border);
      border-radius: 0.5rem;
      color: var(--nexus-text-primary);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0.4rem 0.9rem;
      transition: all 0.2s ease;
    }
    .pagination-btn:disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }
    .pagination-btn:not(:disabled):hover {
      background: var(--nexus-border);
    }
    .pagination-info {
      color: var(--nexus-text-secondary);
      font-size: 0.85rem;
    }
    .right-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
    }
    .right-sidebar > :last-child {
      margin-top: auto;
    }
    a:hover,
    button:hover {
      filter: brightness(1.08);
    }
    .join-button:hover {
      background: var(--nexus-border);
      transform: translateY(-1px);
    }
    .plus-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(179, 116, 255, 0.3);
    }
    .feed-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    }
    a:focus-visible,
    button:focus-visible {
      border-color: #b374ff;
      outline: 2px solid #b374ff;
      outline-offset: 2px;
    }
    .visually-hidden {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
    @media (max-width: 1200px) {
      .main-grid {
        grid-template-columns: 1fr;
        overflow: auto;
      }
      .feed-column {
        overflow: visible;
      }
      .left-sidebar,
      .right-sidebar {
        height: auto;
      }
      .sidebar-footer {
        margin-top: 0;
      }
    }
  `,
})
export class HomePageComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  private readonly postsService = inject(PostsService);
  private readonly likesService = inject(LikesService);
  protected readonly keycloak = this.auth.instance;
  protected isConnected = signal(this.keycloak?.authenticated ?? false);

  protected readonly sidebarItems = signal<ReadonlyArray<SidebarItem>>(
    createSidebarItems(['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6']),
  );

  protected readonly feedCards = signal<FeedCard[]>([]);
  protected readonly currentPage = signal(1);
  protected readonly hasNextPage = signal(false);
  protected readonly hasPreviousPage = signal(false);
  protected readonly totalCount = signal(0);
  private readonly PAGE_SIZE = 10;

  ngOnInit(): void {
    this.loadFeed(1);
  }

  protected loadFeed(page: number): void {
    this.postsService.listPosts(page, this.PAGE_SIZE).subscribe({
      next: (response) => {
        const cards: FeedCard[] = response.items.map((post: PostDto) => ({
          id: post.id,
          author: post.authorName,
          title: post.title,
          description: post.content,
          tags: post.tags,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          isLiked: post.isLikedByCurrentUser,
        }));
        this.feedCards.set(cards);
        this.currentPage.set(response.page);
        this.hasNextPage.set(response.hasNextPage);
        this.hasPreviousPage.set(response.hasPreviousPage);
        this.totalCount.set(response.totalCount);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des posts :', err);
      },
    });
  }

  protected toggleLike(card: FeedCard, event: Event): void {
    event.stopPropagation();
    if (!this.isConnected()) return;

    const wasLiked = card.isLiked;
    card.isLiked = !wasLiked;
    card.likeCount += wasLiked ? -1 : 1;
    this.feedCards.update(cards => [...cards]);

    this.likesService.toggleLike(card.id).subscribe({
      next: (res) => {
        card.isLiked = res.isLiked;
        card.likeCount = res.likeCount;
        this.feedCards.update(cards => [...cards]);
      },
      error: (err) => {
        card.isLiked = wasLiked;
        card.likeCount += wasLiked ? 1 : -1;
        this.feedCards.update(cards => [...cards]);
        console.error('[Home] Failed to toggle like:', err);
      },
    });
  }

  protected nextPage(): void {
    this.loadFeed(this.currentPage() + 1);
  }

  protected previousPage(): void {
    this.loadFeed(this.currentPage() - 1);
  }

  protected readonly topicDiscoveries = signal<ReadonlyArray<DiscoveryItem>>([
    { id: 't1', name: 'Kubernetes', metric: '8465 posts' },
    { id: 't2', name: 'Cybersécurité', metric: '6542 posts' },
    { id: 't3', name: 'PostgreSQL', metric: '875 posts' },
  ]);

  protected readonly groupDiscoveries = signal<ReadonlyArray<DiscoveryItem>>([
    { id: 'g1', name: 'Diiage', metric: '8465 utilisateurs' },
    { id: 'g2', name: 'Microsoft', metric: '526 utilisateurs' },
    { id: 'g3', name: 'Windows', metric: '352 utilisateurs' },
    { id: 'g4', name: 'Linux', metric: '200 utilisateurs' },
  ]);

  protected async openEditor(title: string) {
    await this.router.navigate(['/editor'], { queryParams: { title } });
  }

  protected async navigateToPost(id: string) {
    await this.router.navigate(['/posts', id]);
  }
}
