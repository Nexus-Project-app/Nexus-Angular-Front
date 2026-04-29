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
})
export class EditorPageComponent {
  readonly titleText = signal('Document sans titre');
  readonly wordCount = signal(0);
  readonly isSaved = signal(true);
  readonly isEditorReady = signal(false);
  readonly markdownSource = signal(INITIAL_CONTENT);
  readonly isMarkdownPanelOpen = signal(false);

  private readonly editorRoot = viewChild.required<ElementRef<HTMLDivElement>>('editorRoot');
  private readonly destroyRef = inject(DestroyRef);
  private crepe: Crepe | null = null;
  private _sourceTextareaFocused = false;
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      void this.initEditor();
    });

    this.destroyRef.onDestroy(() => {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
      void this.crepe?.destroy();
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

  onTitleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.titleText.set(input.value);
  }

  toggleMarkdownPanel(): void {
    this.isMarkdownPanelOpen.update((v) => !v);
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

    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      this.crepe?.editor.action(replaceAll(markdown));
    }, 300);
  }
}
