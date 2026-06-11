import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, takeUntil, catchError } from 'rxjs';
import { SearchService } from '@shared/services/search.service';
import { PostDto } from '@features/posts/models/post.model';
import { GroupSummaryDto } from '@features/groups/models/group.model';

export type SearchResultItem =
  | { kind: 'post'; data: PostDto }
  | { kind: 'group'; data: GroupSummaryDto };

@Component({
  selector: 'app-search-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.css',
})
export class SearchModalComponent implements OnInit, OnDestroy {
  readonly open = input.required<boolean>();
  readonly closed = output<void>();

  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  protected readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly query = signal('');
  protected readonly loading = signal(false);
  protected readonly results = signal<SearchResultItem[]>([]);
  protected readonly activeIndex = signal(-1);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.focusInput();
      }
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q: string) => {
          const trimmed = q.trim();
          if (trimmed.length < 2) {
            this.results.set([]);
            this.loading.set(false);
            return of(null);
          }
          this.loading.set(true);
          return this.searchService.searchAll(trimmed).pipe(
            catchError(() => of(null)),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((response) => {
        this.loading.set(false);
        if (!response) {
          this.results.set([]);
          this.activeIndex.set(-1);
          return;
        }
        const items: SearchResultItem[] = [
          ...response.posts.items.map((p): SearchResultItem => ({ kind: 'post', data: p })),
          ...response.groups.items.map((g): SearchResultItem => ({ kind: 'group', data: g })),
        ];
        this.results.set(items);
        this.activeIndex.set(-1);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onQueryChange(value: string): void {
    this.query.set(value);
    this.search$.next(value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const list = this.results();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.min(i + 1, list.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.max(i - 1, -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const idx = this.activeIndex();
      if (idx >= 0 && idx < list.length) {
        this.navigate(list[idx]);
      }
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  protected navigate(item: SearchResultItem): void {
    if (item.kind === 'post') {
      void this.router.navigate(['/posts', item.data.id]);
    } else {
      void this.router.navigate(['/groups', item.data.id]);
    }
    this.close();
  }

  protected close(): void {
    this.query.set('');
    this.results.set([]);
    this.activeIndex.set(-1);
    this.closed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('search-backdrop')) {
      this.close();
    }
  }

  private focusInput(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.inputRef()?.nativeElement.focus(), 50);
    }
  }
}
