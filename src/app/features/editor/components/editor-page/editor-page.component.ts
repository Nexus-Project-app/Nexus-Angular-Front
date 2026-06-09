import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { Crepe, CrepeFeature } from '@milkdown/crepe';
import { replaceAll } from '@milkdown/kit/utils';
import { PostsService } from '@shared/services/posts.service';
import { PostDto } from '@features/posts/models/post.model';
import { AttachmentService } from '@shared/services/attachment.service';
import { createImageUploader } from '../../utils/uploader.factory';
import { INITIAL_CONTENT } from './editor-initial-content';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NavbarComponent],
})
export class EditorPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);
  private readonly attachmentService = inject(AttachmentService);
  readonly titleText = signal(this.getInitialTitle());
  readonly wordCount = signal(0);
  // Nouveau post = false (pas encore sauvegardé), édition = true (déjà en base)
  readonly isSaved = signal(Boolean(this.route.snapshot.queryParamMap.get('id')));
  readonly isSaving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly isEditorReady = signal(false);
  readonly markdownSource = signal(INITIAL_CONTENT);
  readonly isMarkdownPanelOpen = signal(false);
  readonly isLeaveModalOpen = signal(false);

  private readonly editorRoot = viewChild.required<ElementRef<HTMLDivElement>>('editorRoot');
  private readonly destroyRef = inject(DestroyRef);
  private crepe: Crepe | null = null;
  private _sourceTextareaFocused = false;
  private _applySourceTimer: ReturnType<typeof setTimeout> | null = null;
  private _leaveResolver: ((value: boolean) => void) | null = null;

  constructor() {
    afterNextRender(() => {
      this.initEditor().catch((error: Error) => {
        console.error(error);
      });
    });

    this.destroyRef.onDestroy(() => {
      if (this._applySourceTimer) {
        clearTimeout(this._applySourceTimer);
      }
      const destroyPromise = this.crepe?.destroy();
      if (destroyPromise) {
        destroyPromise.catch((error: Error) => {
          console.error(error);
        });
      }
    });
  }

  private async initEditor(): Promise<void> {
    const existingPost = await this.loadExistingPost();
    const root = this.editorRoot().nativeElement;
    const initialValue = existingPost?.content ?? INITIAL_CONTENT;

    if (existingPost) {
      this.titleText.set(existingPost.title);
      this.markdownSource.set(existingPost.content);
    }

    const postId = this.route.snapshot.queryParamMap.get('id') ?? crypto.randomUUID();

    this.crepe = new Crepe({
      root,
      defaultValue: initialValue,
      featureConfigs: {
        [CrepeFeature.ImageBlock]: {
          onUpload: createImageUploader(postId, this.attachmentService),
        },
      },
    });

    this.crepe.on((listener) => {
      listener.markdownUpdated((_ctx, markdown) => {
        const words = markdown.trim().split(/\s+/).filter(Boolean).length;
        this.wordCount.set(words);
        this.isSaved.set(false);
        if (!this._sourceTextareaFocused) {
          this.markdownSource.set(markdown);
        }
      });
    });

    await this.crepe.create();
    this.isEditorReady.set(true);
  }

  onSave(): void {
    if (this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    const payload = {
      title: this.titleText().trim(),
      content: this.markdownSource(),
      tags: [] as ReadonlyArray<string>,
    };

    const postId = this.route.snapshot.queryParamMap.get('id');

    if (postId) {
      this.postsService.updatePost(postId, payload).subscribe({
        next: () => {
          this.isSaved.set(true);
          this.isSaving.set(false);
          this.router.navigate(['/posts', postId]);
        },
        error: (error: Error) => {
          console.error('Failed to update post', error);
          this.isSaving.set(false);
          this.saveError.set('La mise à jour a échoué. Vérifie ta connexion et réessaie.');
        },
      });
      return;
    }

    this.postsService.createPost(payload).subscribe({
      next: (newPostId) => {
        this.isSaved.set(true);
        this.isSaving.set(false);
        this.router.navigate(['/posts', newPostId]);
      },
      error: (error: Error) => {
        console.error('Failed to create post', error);
        this.isSaving.set(false);
        this.saveError.set('La sauvegarde a échoué. Vérifie ta connexion et réessaie.');
      },
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.isSaved()) {
      return true;
    }
    return new Promise<boolean>((resolve) => {
      this._leaveResolver = resolve;
      this.isLeaveModalOpen.set(true);
    });
  }

  onBackClick(): void {
    void this.router.navigate(['/']);
  }

  confirmLeave(): void {
    this._leaveResolver?.(true);
    this._leaveResolver = null;
    this.isLeaveModalOpen.set(false);
  }

  cancelLeave(): void {
    this._leaveResolver?.(false);
    this._leaveResolver = null;
    this.isLeaveModalOpen.set(false);
  }

  onTitleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.titleText.set(input.value);
  }

  private getInitialTitle(): string {
    const title = this.route.snapshot.queryParamMap.get('title')?.trim();
    return title ?? 'Document sans titre';
  }

  private async loadExistingPost(): Promise<PostDto | null> {
    const postId = this.route.snapshot.queryParamMap.get('id');
    if (!postId) {
      return null;
    }

    return await new Promise<PostDto | null>((resolve) => {
      this.postsService.getPostById(postId).subscribe({
        next: (post) => resolve(post),
        error: () => resolve(null),
      });
    });
  }

  toggleMarkdownPanel(): void {
    this.isMarkdownPanelOpen.update((v) => !v);
  }

  onEditorKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.focusEditor();
    }
  }

  onSourceFocus(): void {
    this._sourceTextareaFocused = true;
  }

  onSourceBlur(): void {
    this._sourceTextareaFocused = false;
  }

  onSourceInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const markdown = textarea.value;
    this.markdownSource.set(markdown);

    if (this._applySourceTimer) {
      clearTimeout(this._applySourceTimer);
    }
    this._applySourceTimer = setTimeout(() => {
      if (this.crepe) {
        this.crepe.editor.action(replaceAll(markdown, true));
      }
    }, 80);
  }

  focusEditor(): void {
    if (!this.crepe) {
      return;
    }
    const pm = this.editorRoot().nativeElement.querySelector<HTMLElement>('.ProseMirror');
    pm?.focus();
  }
}
