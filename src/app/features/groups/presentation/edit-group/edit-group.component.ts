import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { GroupsService } from '@shared/services/groups.service';
import { GroupVisibility } from '../../models/group.model';

@Component({
  selector: 'app-edit-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.css',
})
export class EditGroupComponent {
  private readonly groupsService = inject(GroupsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  protected readonly submitting = signal(false);
  protected readonly deleting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly groupId = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    visibility: [0 as GroupVisibility],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.groupId.set(id);

    this.groupsService.getGroupById(id).subscribe({
      next: (g) => {
        this.form.patchValue({
          name: g.name,
          description: g.description,
          visibility: g.visibility,
        });
      },
      error: (err: Error) => {
        this.error.set('Impossible de charger le groupe.');
        console.error('[EditGroup]', err);
      },
    });
  }

  protected submit(): void {
    const id = this.groupId();
    if (!id || this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const { name, description, visibility } = this.form.getRawValue();

    this.groupsService.updateGroup(id, { name, description, visibility }).subscribe({
      next: () => void this.router.navigate(['/groups', id]),
      error: (err: Error) => {
        this.error.set('Erreur lors de la mise à jour.');
        console.error('[EditGroup]', err);
        this.submitting.set(false);
      },
    });
  }

  protected deleteGroup(): void {
    const id = this.groupId();
    if (!id || !confirm('Supprimer définitivement ce groupe et tous ses posts ?')) {
      return;
    }

    this.deleting.set(true);
    this.groupsService.deleteGroup(id).subscribe({
      next: () => void this.router.navigate(['/groups']),
      error: (err: Error) => {
        console.error('[EditGroup] Failed to delete:', err);
        this.deleting.set(false);
      },
    });
  }

  protected cancel(): void {
    const id = this.groupId();
    void this.router.navigate(id ? ['/groups', id] : ['/groups']);
  }
}
