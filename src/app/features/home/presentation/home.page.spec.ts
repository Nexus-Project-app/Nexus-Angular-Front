import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HomePageComponent } from './home.page';
import { AuthService } from '@shared/services/auth.service';
import { PostsService } from '@shared/services/posts.service';
import { LikesService } from '@shared/services/likes.service';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let router: Router;
  const navigateCalls: unknown[][] = [];

  beforeEach(async () => {
    const authServiceMock = {
      instance: {
        authenticated: true,
        idTokenParsed: {
          preferred_username: 'Adrien',
          email: 'adrien@example.com',
        },
        realmAccess: { roles: ['admin'] },
      },
    };

    const postsServiceMock = {
      listPosts: () =>
        of({
          items: [
            {
              id: 'post-1',
              authorId: 'author-1',
              authorName: 'Alice',
              title: 'Hello Nexus',
              content: 'Contenu du post',
              tags: ['tag1'],
              created: '2026-06-09T07:00:00Z',
              updated: '2026-06-09T07:00:00Z',
              likeCount: 2,
              commentCount: 1,
              isLikedByCurrentUser: false,
            },
          ],
          page: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          totalCount: 1,
        }),
    };

    const likesServiceMock = {
      toggleLike: () => of({ isLiked: true, likeCount: 3 }),
    };

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostsService, useValue: postsServiceMock },
        { provide: LikesService, useValue: likesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    router = TestBed.inject(Router);
    router.navigate = async (...args: unknown[]) => {
      navigateCalls.push(args);
      return true;
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the loaded post', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Hello Nexus');
    expect(compiled.textContent).toContain('Alice');
  });

  it('should navigate to a post when the article is clicked', () => {
    const article = fixture.nativeElement.querySelector('article') as HTMLElement;
    article.dispatchEvent(new Event('click', { bubbles: true }));

    expect(navigateCalls).toEqual([[['/posts', 'post-1']]]);
  });
});
