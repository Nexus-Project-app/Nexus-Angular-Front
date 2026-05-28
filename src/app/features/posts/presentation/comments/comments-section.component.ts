import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../../../shared/services/comments.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommentDto } from '../../models/comment.model';

@Component({
  selector: 'app-comments-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.css',
})
export class CommentsSectionComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  private readonly authService = inject(AuthService);

  /** ID du post dont on affiche les commentaires */
  readonly postId = input.required<string>();
  /** ID de l'utilisateur connecté (null si non connecté) */
  readonly currentUserId = input<string | null>(null);

  protected readonly isConnected = signal(this.authService.instance?.authenticated ?? false);

  protected readonly comments = signal<CommentDto[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly currentPage = signal(1);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly updating = signal(false);
  protected readonly submitError = signal<string | null>(null);

  // Valeurs de formulaire en propriétés simples (liées via ngModel)
  protected newContentValue = '';
  protected editContentValue = '';
  protected readonly editingId = signal<string | null>(null);

  private readonly PAGE_SIZE = 5;

  protected readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.PAGE_SIZE));

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  ngOnInit(): void {
    this.loadComments(1);
  }

  private loadComments(page: number): void {
    this.loading.set(true);
    this.commentsService.getComments(this.postId(), page, this.PAGE_SIZE).subscribe({
      next: (response) => {
        this.comments.set([...response.items]);
        this.totalCount.set(response.totalCount);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: (err: Error) => {
        console.error('[Comments] Failed to load comments:', err);
        this.loading.set(false);
      },
    });
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.loadComments(page);
  }

  protected submitComment(): void {
    const content = this.newContentValue.trim();
    if (!content) {
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.commentsService.addComment(this.postId(), content).subscribe({
      next: () => {
        this.newContentValue = '';
        this.submitting.set(false);
        this.loadComments(1);
      },
      error: (err: Error) => {
        console.error('[Comments] Failed to add comment:', err);
        this.submitError.set("Une erreur est survenue lors de l'envoi du commentaire.");
        this.submitting.set(false);
      },
    });
  }

  protected startEdit(comment: CommentDto): void {
    this.editingId.set(comment.id);
    this.editContentValue = comment.content;
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
    this.editContentValue = '';
  }

  protected submitEdit(commentId: string): void {
    const content = this.editContentValue.trim();
    if (!content) {
      return;
    }

    this.updating.set(true);
    this.commentsService.updateComment(commentId, content).subscribe({
      next: () => {
        this.updating.set(false);
        this.editingId.set(null);
        this.editContentValue = '';
        this.loadComments(this.currentPage());
      },
      error: (err: Error) => {
        console.error('[Comments] Failed to update comment:', err);
        this.updating.set(false);
      },
    });
  }

  protected deleteComment(commentId: string): void {
    if (!confirm('Supprimer ce commentaire ?')) {
      return;
    }

    this.commentsService.deleteComment(commentId).subscribe({
      next: () => {
        const newTotal = this.totalCount() - 1;
        const maxPage = Math.ceil(newTotal / this.PAGE_SIZE) || 1;
        const targetPage = Math.min(this.currentPage(), maxPage);
        this.loadComments(targetPage);
      },
      error: (err: Error) => console.error('[Comments] Failed to delete comment:', err),
    });
  }

  protected isCommentOwner(comment: CommentDto): boolean {
    const uid = this.currentUserId();
    return Boolean(uid && comment.authorId === uid);
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }
}
