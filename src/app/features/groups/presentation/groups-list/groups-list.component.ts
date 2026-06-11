import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { GroupsService } from '@shared/services/groups.service';
import { AuthService } from '@shared/services/auth.service';
import {
  GroupSummaryDto,
  GroupVisibilityLabel,
} from '../../models/group.model';

@Component({
  selector: 'app-groups-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavbarComponent, CreateGroupComponent],
  templateUrl: './groups-list.component.html',
  styleUrl: './groups-list.component.css',
})
export class GroupsListComponent {
  private readonly groupsService = inject(GroupsService);
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  protected readonly groups = signal<GroupSummaryDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly showCreateModal = signal(false);
  protected readonly visibilityLabel = GroupVisibilityLabel;

  constructor() {
    this.groupsService.listGroups().subscribe({
      next: (res) => {
        this.groups.set([...res.items]);
        this.loading.set(false);
      },
      error: (err: Error) => {
        console.error('[GroupsList] Failed to load groups:', err);
        this.loading.set(false);
      },
    });
  }

  protected goBack(): void {
    void this.router.navigate(['/']);
  }

  protected navigateToGroup(id: string): void {
    void this.router.navigate(['/groups', id]);
  }

  protected createGroup(): void {
    this.showCreateModal.set(true);
  }
}
