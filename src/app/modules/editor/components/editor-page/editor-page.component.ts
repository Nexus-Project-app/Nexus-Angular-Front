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
import { Editor } from '@milkdown/kit/core';
import { rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/kit/preset/gfm';
import { history } from '@milkdown/kit/plugin/history';
import { clipboard } from '@milkdown/kit/plugin/clipboard';
import { cursor } from '@milkdown/kit/plugin/cursor';
import { indent } from '@milkdown/kit/plugin/indent';
import { trailing } from '@milkdown/kit/plugin/trailing';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';

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

  private readonly editorRoot = viewChild.required<ElementRef<HTMLDivElement>>('editorRoot');
  private readonly destroyRef = inject(DestroyRef);
  private editor: Editor | null = null;

  constructor() {
    afterNextRender(() => {
      void this.initEditor();
    });

    this.destroyRef.onDestroy(() => {
      void this.editor?.destroy();
    });
  }

  private async initEditor(): Promise<void> {
    const root = this.editorRoot().nativeElement;

    this.editor = await Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, INITIAL_CONTENT);
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(clipboard)
      .use(cursor)
      .use(indent)
      .use(trailing)
      .use(listener)
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
          const words = markdown.trim().split(/\s+/).filter(Boolean).length;
          this.wordCount.set(words);
          this.isSaved.set(false);
        });
      })
      .create();

    this.isEditorReady.set(true);
  }

  onSave(): void {
    this.isSaved.set(true);
  }

  onTitleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.titleText.set(input.value);
  }
}
