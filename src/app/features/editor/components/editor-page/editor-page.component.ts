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
import { NavbarComponent } from '../../../../shared/components/navbar.component';
import { Crepe } from '@milkdown/crepe';
import { replaceAll } from '@milkdown/kit/utils';

const INITIAL_CONTENT = `# Titre du document

Rédigez votre contenu ici. L'éditeur supporte la syntaxe **Markdown** complète.

## Formatage de base

- **Gras** avec \`**texte**\`
- *Italique* avec \`*texte*\`
- \`Code inline\` avec \` \`code\` \`
- ~~Barré~~ avec \`~~texte~~\`

## Tableau

| Colonne 1 | Colonne 2 | Colonne 3 |
| --------- | --------- | --------- |
| Valeur    | Valeur    | Valeur    |

## Bloc de code

\`\`\`typescript
const salutation = 'Bienvenue sur Nexus';
console.log(salutation);
\`\`\`

> Utilisez \`Ctrl+Z\` pour annuler et \`Ctrl+Y\` pour rétablir.
`;

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
  readonly titleText = signal(this.getInitialTitle());
  readonly wordCount = signal(0);
  readonly isSaved = signal(true);
  readonly isEditorReady = signal(false);
  readonly markdownSource = signal(INITIAL_CONTENT);
  readonly isMarkdownPanelOpen = signal(false);
  readonly isLeaveModalOpen = signal(false);

  private readonly editorRoot = viewChild.required<ElementRef<HTMLDivElement>>('editorRoot');
  private readonly destroyRef = inject(DestroyRef);
  private crepe: Crepe | null = null;
  private _sourceTextareaFocused = false;
  private _applySourceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      this.initEditor().catch((error: Error) => {
        console.error(error);
      });
    });

    this.destroyRef.onDestroy(() => {
      if (this._applySourceTimer) clearTimeout(this._applySourceTimer);
      const destroyPromise = this.crepe?.destroy();
      if (destroyPromise) {
        destroyPromise.catch((error: Error) => {
          console.error(error);
        });
      }
    });
  }

  private async initEditor(): Promise<void> {
    const root = this.editorRoot().nativeElement;

    this.crepe = new Crepe({
      root,
      defaultValue: INITIAL_CONTENT,
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
    this.isSaved.set(true);
  }

  async onBackClick(): Promise<void> {
    if (this.isSaved()) {
      await this.router.navigate(['/']);
    } else {
      this.isLeaveModalOpen.set(true);
    }
  }

  async confirmLeave(): Promise<void> {
    await this.router.navigate(['/']);
  }

  cancelLeave(): void {
    this.isLeaveModalOpen.set(false);
  }

  onTitleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.titleText.set(input.value);
  }

  private getInitialTitle(): string {
    const title = this.route.snapshot.queryParamMap.get('title')?.trim();
    return title || 'Document sans titre';
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

    if (this._applySourceTimer) clearTimeout(this._applySourceTimer);
    this._applySourceTimer = setTimeout(() => {
      if (this.crepe) {
        this.crepe.editor.action(replaceAll(markdown, true));
      }
    }, 80);
  }

  focusEditor(): void {
    if (!this.crepe) return;
    const pm = this.editorRoot().nativeElement.querySelector<HTMLElement>('.ProseMirror');
    pm?.focus();
  }
}
