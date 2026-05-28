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
import { CommentsService } from '../../../infrastructure/services/comments.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CommentDto } from '../models/comment.model';

@Component({
  selector: 'app-comments-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="comments-section">
      <h2 class="comments-title">
        Commentaires
        <span *ngIf="totalCount() > 0" class="comments-count">({{ totalCount() }})</span>
      </h2>

      <!-- Formulaire d'ajout — visible uniquement si connecté -->
      <div *ngIf="isConnected()" class="comment-form">
        <p class="comment-form__label">Laisser un commentaire</p>
        <textarea
          [(ngModel)]="newContentValue"
          placeholder="Écrivez votre commentaire..."
          rows="3"
          class="comment-form__textarea"
        ></textarea>
        <div class="comment-form__actions">
          <p *ngIf="submitError()" class="comment-form__error">{{ submitError() }}</p>
          <button
            type="button"
            class="btn-primary"
            [disabled]="!newContentValue.trim() || submitting()"
            (click)="submitComment()"
          >
            {{ submitting() ? 'Envoi...' : 'Publier' }}
          </button>
        </div>
      </div>

      <!-- Message si non connecté -->
      <div *ngIf="!isConnected()" class="comments-login-hint">
        <p>Connectez-vous pour laisser un commentaire.</p>
      </div>

      <!-- Chargement -->
      <div *ngIf="loading()" class="comments-empty">
        <p>Chargement des commentaires...</p>
      </div>

      <!-- Aucun commentaire -->
      <div *ngIf="!loading() && comments().length === 0" class="comments-empty">
        <p>Aucun commentaire pour l'instant. Soyez le premier !</p>
      </div>

      <!-- Liste -->
      <div *ngIf="!loading() && comments().length > 0" class="comments-list">
        <div *ngFor="let comment of comments()" class="comment-card">

          <!-- Mode lecture -->
          <ng-container *ngIf="editingId() !== comment.id">
            <div class="comment-card__body">
              <p class="comment-card__content">{{ comment.content }}</p>
              <div *ngIf="isCommentOwner(comment)" class="comment-card__actions">
                <button type="button" class="btn-ghost" (click)="startEdit(comment)">Modifier</button>
                <button type="button" class="btn-ghost btn-ghost--danger" (click)="deleteComment(comment.id)">Supprimer</button>
              </div>
            </div>
            <p class="comment-card__date">{{ formatDate(comment.created) }}</p>
          </ng-container>

          <!-- Mode édition -->
          <ng-container *ngIf="editingId() === comment.id">
            <textarea
              [(ngModel)]="editContentValue"
              rows="3"
              class="comment-form__textarea comment-form__textarea--editing"
            ></textarea>
            <div class="comment-card__edit-actions">
              <button type="button" class="btn-secondary" (click)="cancelEdit()">Annuler</button>
              <button
                type="button"
                class="btn-primary btn-primary--sm"
                [disabled]="!editContentValue.trim() || updating()"
                (click)="submitEdit(comment.id)"
              >
                {{ updating() ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Pagination -->
      <nav *ngIf="totalPages() > 1" class="comments-pagination">
        <button
          type="button"
          class="pagination-btn"
          [disabled]="currentPage() === 1"
          (click)="goToPage(currentPage() - 1)"
        >
          ← Précédent
        </button>

        <button
          *ngFor="let p of pageNumbers()"
          type="button"
          class="pagination-page"
          [class.pagination-page--active]="p === currentPage()"
          (click)="goToPage(p)"
        >
          {{ p }}
        </button>

        <button
          type="button"
          class="pagination-btn"
          [disabled]="currentPage() === totalPages()"
          (click)="goToPage(currentPage() + 1)"
        >
          Suivant →
        </button>
      </nav>
    </section>
  `,
  styles: `
    .comments-section {
      margin-top: 2rem;
    }

    .comments-title {
      color: var(--nexus-text-primary);
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 1.25rem;
    }

    .comments-count {
      color: var(--nexus-text-secondary);
      font-size: 0.875rem;
      font-weight: 400;
      margin-left: 0.4rem;
    }

    /* ── Formulaire ── */
    .comment-form {
      background: var(--nexus-bg-component);
      border: 1px solid var(--nexus-border);
      border-radius: 1rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .comment-form__label {
      color: var(--nexus-text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }

    .comment-form__textarea {
      background: var(--nexus-bg);
      border: 1px solid var(--nexus-border);
      border-radius: 0.75rem;
      color: var(--nexus-text-primary);
      font-family: inherit;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 0.75rem 1rem;
      resize: none;
      transition: border-color 0.2s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .comment-form__textarea::placeholder {
      color: color-mix(in srgb, var(--nexus-text-secondary) 78%, transparent);
    }

    .comment-form__textarea:focus {
      border-color: var(--nexus-interaction);
      outline: none;
    }

    .comment-form__textarea--editing {
      border-color: var(--nexus-interaction);
    }

    .comment-form__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .comment-form__error {
      color: #f87171;
      font-size: 0.75rem;
      margin: 0;
      flex: 1;
    }

    /* ── Hint non connecté ── */
    .comments-login-hint {
      background: var(--nexus-bg-component);
      border: 1px solid var(--nexus-border);
      border-radius: 1rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .comments-login-hint p {
      color: var(--nexus-text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }

    /* ── États vides / chargement ── */
    .comments-empty {
      text-align: center;
      padding: 2rem 0;
    }

    .comments-empty p {
      color: var(--nexus-text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }

    /* ── Liste des commentaires ── */
    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .comment-card {
      background: var(--nexus-bg-component);
      border: 1px solid var(--nexus-border);
      border-radius: 1rem;
      padding: 1rem;
    }

    .comment-card__body {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .comment-card__content {
      color: var(--nexus-text-primary);
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
      flex: 1;
    }

    .comment-card__actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .comment-card__date {
      color: var(--nexus-text-secondary);
      font-size: 0.75rem;
      margin: 0.6rem 0 0;
    }

    .comment-card__edit-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      margin-top: 0.625rem;
    }

    /* ── Boutons ── */
    .btn-primary {
      background: linear-gradient(135deg, #b374ff, #076eff);
      border: 0;
      border-radius: 0.75rem;
      color: #ffffff;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 700;
      min-height: 2.5rem;
      padding: 0 1.25rem;
      transition: filter 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
      white-space: nowrap;
    }

    .btn-primary:hover:not(:disabled) {
      filter: brightness(1.06);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .btn-primary--sm {
      font-size: 0.8rem;
      min-height: 2rem;
      padding: 0 1rem;
    }

    .btn-secondary {
      background: var(--nexus-surface-raised);
      border: 1px solid var(--nexus-border);
      border-radius: 0.75rem;
      color: var(--nexus-text-primary);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.8rem;
      min-height: 2rem;
      padding: 0 1rem;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: var(--nexus-border);
    }

    .btn-ghost {
      background: transparent;
      border: 0;
      color: var(--nexus-text-secondary);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.75rem;
      padding: 0;
      transition: color 0.2s ease;
    }

    .btn-ghost:hover {
      color: var(--nexus-interaction);
    }

    .btn-ghost--danger:hover {
      color: #f87171;
    }

    /* ── Pagination ── */
    .comments-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }

    .pagination-btn {
      background: var(--nexus-surface-raised);
      border: 1px solid var(--nexus-border);
      border-radius: 0.5rem;
      color: var(--nexus-text-primary);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.85rem;
      padding: 0.4rem 0.9rem;
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--nexus-border);
    }

    .pagination-btn:disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }

    .pagination-page {
      background: var(--nexus-surface-raised);
      border: 1px solid var(--nexus-border);
      border-radius: 0.5rem;
      color: var(--nexus-text-secondary);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.85rem;
      height: 2.25rem;
      width: 2.25rem;
      transition: all 0.2s ease;
    }

    .pagination-page:hover:not(.pagination-page--active) {
      background: var(--nexus-border);
      color: var(--nexus-text-primary);
    }

    .pagination-page--active {
      background: linear-gradient(135deg, #b374ff, #076eff);
      border-color: transparent;
      color: #ffffff;
      cursor: default;
      font-weight: 700;
    }
  `,
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

  protected readonly totalPages = computed(() =>
    Math.ceil(this.totalCount() / this.PAGE_SIZE)
  );

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
    if (page < 1 || page > this.totalPages()) return;
    this.loadComments(page);
  }

  protected submitComment(): void {
    const content = this.newContentValue.trim();
    if (!content) return;

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
    if (!content) return;

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
    if (!confirm('Supprimer ce commentaire ?')) return;

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
