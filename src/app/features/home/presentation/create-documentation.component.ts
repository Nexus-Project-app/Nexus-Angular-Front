import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';

@Component({
  selector: 'app-create-documentation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="create-documentation" aria-labelledby="create-documentation-title">
      <div class="create-documentation__content">
        <h2 id="create-documentation-title">Créer une documentation</h2>
        <p>Écrivez ici le titre</p>
      </div>

      <div class="create-documentation__actions">
        <label class="visually-hidden" for="documentation-title">Titre de la documentation</label>
        <input
          id="documentation-title"
          type="text"
          class="create-documentation__input"
          [value]="title()"
          (input)="onTitleInput($event)"
          placeholder="Écrivez ici le titre"
          aria-label="Titre de la documentation"
        />
        <button
          type="button"
          class="create-documentation__button"
          [disabled]="!canCreate()"
          (click)="onCreate()"
        >
          Créer
        </button>
      </div>
    </section>
  `,
  styles: `
    .create-documentation {
      align-items: stretch;
      background: var(--nexus-bg-component);
      border: 1px solid var(--nexus-border);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      padding: 1rem;
    }

    .create-documentation__content {
      min-width: 0;
    }

    .create-documentation__content h2 {
      color: var(--nexus-text-primary);
      font-size: 1rem;
      margin: 0 0 0.25rem;
    }

    .create-documentation__content p {
      color: color-mix(in srgb, var(--nexus-text-secondary) 82%, transparent);
      font-size: 0.875rem;
      margin: 0;
    }

    .create-documentation__actions {
      align-items: center;
      display: flex;
      gap: 0.75rem;
      min-width: 0;
    }

    .create-documentation__input {
      background: var(--nexus-bg);
      border: 1px solid var(--nexus-border);
      border-radius: 0.75rem;
      color: var(--nexus-text-primary);
      flex: 1;
      min-width: 0;
      padding: 0.8rem 0.9rem;
    }

    .create-documentation__input::placeholder {
      color: color-mix(in srgb, var(--nexus-text-secondary) 78%, transparent);
    }

    .create-documentation__button {
      background: linear-gradient(135deg, #b374ff, #076eff);
      border: 0;
      border-radius: 0.75rem;
      color: #ffffff;
      cursor: pointer;
      flex: 0 0 auto;
      font-weight: 700;
      min-height: 2.75rem;
      padding: 0 1rem;
      transition:
        transform 0.2s ease,
        filter 0.2s ease,
        opacity 0.2s ease;
      white-space: nowrap;
    }

    .create-documentation__button:hover:not(:disabled) {
      filter: brightness(1.06);
      transform: translateY(-1px);
    }

    .create-documentation__button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .visually-hidden {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
  `,
})
export class CreateDocumentationComponent {
  protected readonly title = signal('');
  protected readonly normalizedTitle = computed(() => this.title().trim());
  protected readonly canCreate = computed(() => this.normalizedTitle().length > 0);

  readonly created = output<string>();

  protected onTitleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.title.set(input.value);
  }

  protected onCreate(): void {
    const title = this.normalizedTitle();
    if (!title) {
      return;
    }

    this.created.emit(title);
  }
}
