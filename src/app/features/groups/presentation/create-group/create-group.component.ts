import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupsService } from '@shared/services/groups.service';
import { GroupVisibility } from '../../models/group.model';

@Component({
  selector: 'app-create-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css',
})
export class CreateGroupComponent {
  private readonly groupsService = inject(GroupsService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly closed = output<void>();

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    visibility: [0 as GroupVisibility],
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const { name, description, visibility } = this.form.getRawValue();

    this.groupsService.createGroup({ name, description, visibility }).subscribe({
      next: (id) => {
        void this.router.navigate(['/groups', id]);
      },
      error: (err: Error) => {
        this.error.set('Erreur lors de la création du groupe.');
        console.error('[CreateGroup]', err);
        this.submitting.set(false);
      },
    });
  }

  protected cancel(): void {
    this.closed.emit();
  }
}
