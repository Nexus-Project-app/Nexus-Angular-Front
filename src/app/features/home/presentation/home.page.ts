import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreateDocumentationComponent } from './create-documentation.component';
import { DiscoveryItemComponent } from './discovery-item.component';
import { FooterLinksComponent } from './footer-links.component';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { AuthService } from '@shared/services/auth.service';
import { PostsService } from '@shared/services/posts.service';
import { LikesService } from '@shared/services/likes.service';
import { truncateMarkdown } from '@shared/utils/markdown/truncate-markdown';
import { extractFirstImage } from '@shared/utils/markdown/extract-first-image';
import { formatDate } from '@shared/utils/format-date';
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
  readonly truncatedDescription?: string;
  readonly coverImage: string | null;
  readonly tags: ReadonlyArray<string>;
  updated: string;
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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CreateDocumentationComponent,
    DiscoveryItemComponent,
    FooterLinksComponent,
    NavbarComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePageComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  private readonly postsService = inject(PostsService);
  private readonly likesService = inject(LikesService);
  protected readonly keycloak = this.auth.instance;
  protected isConnected = signal(this.keycloak?.authenticated ?? false);
  protected readonly formatDateFn = formatDate;

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
          author: post.authorName || 'Auteur inconnu',
          title: post.title,
          description: post.content,
          truncatedDescription: truncateMarkdown(post.content, 50),
          coverImage: extractFirstImage(post.content),
          tags: post.tags,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          isLiked: post.isLikedByCurrentUser,
          updated: this.formatDateFn(post.updated),
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
    if (!this.isConnected()) {
      return;
    }

    const wasLiked = card.isLiked;
    card.isLiked = !wasLiked;
    card.likeCount += wasLiked ? -1 : 1;
    this.feedCards.update((cards) => [...cards]);

    this.likesService.toggleLike(card.id).subscribe({
      next: (res) => {
        card.isLiked = res.isLiked;
        card.likeCount = res.likeCount;
        this.feedCards.update((cards) => [...cards]);
      },
      error: (err) => {
        card.isLiked = wasLiked;
        card.likeCount += wasLiked ? 1 : -1;
        this.feedCards.update((cards) => [...cards]);
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
