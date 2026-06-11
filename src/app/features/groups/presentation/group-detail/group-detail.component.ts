import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { GroupsService } from '@shared/services/groups.service';
import { AuthService } from '@shared/services/auth.service';
import { formatDate } from '@shared/utils/format-date';
import {
  GroupDetailDto,
  GroupMemberDto,
  GroupMemberRoleLabel,
  GroupVisibilityLabel,
  JoinRequestDto,
} from '../../models/group.model';
import { PostDto } from '@features/posts/models/post.model';

@Component({
  selector: 'app-group-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavbarComponent],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css',
})
export class GroupDetailComponent {
  private readonly groupsService = inject(GroupsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  protected readonly group = signal<GroupDetailDto | null>(null);
  protected readonly posts = signal<PostDto[]>([]);
  protected readonly members = signal<GroupMemberDto[]>([]);
  protected readonly joinRequests = signal<JoinRequestDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly actionLoading = signal(false);
  protected readonly showSettingsMenu = signal(false);
  protected readonly visibilityLabel = GroupVisibilityLabel;
  protected readonly roleLabel = GroupMemberRoleLabel;
  protected readonly formatDateFn = formatDate;

  protected readonly isModerator = computed(() => {
    const g = this.group();
    return g?.currentUserRole === 1 || g?.currentUserRole === 2;
  });

  protected readonly isOwner = computed(() => {
    return this.group()?.currentUserRole === 2;
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.groupsService.getGroupById(id).subscribe({
      next: (g) => {
        this.group.set(g);
        this.loading.set(false);
        this.loadPosts(id);
        if (g.isMember) {
          this.loadMembers(id);
        }
        if (g.currentUserRole === 1 || g.currentUserRole === 2) {
          this.loadJoinRequests(id);
        }
      },
      error: (err: Error) => {
        console.error('[GroupDetail] Failed to load group:', err);
        this.loading.set(false);
      },
    });
  }

  private loadPosts(id: string): void {
    this.groupsService.getGroupPosts(id).subscribe({
      next: (res) => this.posts.set([...res.items]),
      error: (err: Error) => console.error('[GroupDetail] Failed to load posts:', err),
    });
  }

  private loadMembers(id: string): void {
    this.groupsService.getMembers(id).subscribe({
      next: (members) => this.members.set(members),
      error: (err: Error) => console.error('[GroupDetail] Failed to load members:', err),
    });
  }

  private loadJoinRequests(id: string): void {
    this.groupsService.getJoinRequests(id).subscribe({
      next: (requests) => this.joinRequests.set(requests),
      error: (err: Error) => console.error('[GroupDetail] Failed to load requests:', err),
    });
  }

  protected goBack(): void {
    void this.router.navigate(['/']);
  }

  protected toggleSettings(): void {
    this.showSettingsMenu.update((v) => !v);
  }

  protected closeSettings(): void {
    this.showSettingsMenu.set(false);
  }

  protected joinGroup(): void {
    const g = this.group();
    if (!g || this.actionLoading()) {
      return;
    }
    this.actionLoading.set(true);

    const action$ = g.visibility === 0
      ? this.groupsService.joinGroup(g.id)
      : this.groupsService.requestJoin(g.id);

    action$.subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.groupsService.getGroupById(g.id).subscribe({
          next: (updated) => this.group.set(updated),
          error: () => undefined,
        });
      },
      error: (err: Error) => {
        console.error('[GroupDetail] Failed to join/request:', err);
        this.actionLoading.set(false);
      },
    });
  }

  protected leaveGroup(): void {
    const g = this.group();
    if (!g || !confirm('Quitter ce groupe ?')) {
      return;
    }
    this.groupsService.leaveGroup(g.id).subscribe({
      next: () => void this.router.navigate(['/groups']),
      error: (err: Error) => console.error('[GroupDetail] Failed to leave:', err),
    });
  }

  protected reviewRequest(requestId: string, accept: boolean): void {
    const g = this.group();
    if (!g) {
      return;
    }
    this.groupsService.reviewJoinRequest(g.id, requestId, accept).subscribe({
      next: () => {
        this.joinRequests.update((reqs) => reqs.filter((r) => r.requestId !== requestId));
        if (accept) {
          this.loadMembers(g.id);
        }
      },
      error: (err: Error) => console.error('[GroupDetail] Failed to review request:', err),
    });
  }

  protected kickMember(userId: string): void {
    const g = this.group();
    if (!g || !confirm('Expulser ce membre ?')) {
      return;
    }
    this.groupsService.kickMember(g.id, userId).subscribe({
      next: () => this.members.update((m) => m.filter((mb) => mb.userId !== userId)),
      error: (err: Error) => console.error('[GroupDetail] Failed to kick member:', err),
    });
  }

  protected navigateToPost(id: string): void {
    void this.router.navigate(['/posts', id]);
  }

  protected createPost(): void {
    const g = this.group();
    if (!g) {
      return;
    }
    void this.router.navigate(['/editor'], { queryParams: { groupId: g.id, groupName: g.name } });
  }

  protected editGroup(): void {
    const g = this.group();
    if (!g) {
      return;
    }
    this.showSettingsMenu.set(false);
    void this.router.navigate(['/groups', g.id, 'edit']);
  }
}
