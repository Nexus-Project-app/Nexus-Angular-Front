import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface DiscoveryItem {
  readonly id: string;
  readonly name: string;
  readonly metric: string;
}

@Component({
  selector: 'app-discovery-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="discovery-panel" [attr.aria-labelledby]="headingId()">
      <h2 [id]="headingId()">{{ title() }}</h2>
      <div class="panel-list">
        @for (item of items(); track item.id) {
          <a class="panel-item" href="#" [attr.aria-label]="item.name + ' - ' + item.metric">
            <span class="panel-title">{{ item.name }}</span>
            <span class="panel-metric">{{ item.metric }}</span>
          </a>
        }
      </div>
    </section>
  `,
  styles: `
    .discovery-panel {
      background: #14141F;
      border: 1px solid #28283C;
      border-radius: 1rem;
      padding: 1rem;
      height: fit-content;
    }

    .discovery-panel h2 {
      color: #FFFFFF;
      font-size: 1rem;
      margin: 0 0 0.75rem;
    }

    .panel-list {
      display: grid;
      gap: 0.65rem;
    }

    .panel-item {
      border-radius: 0.65rem;
      color: inherit;
      padding: 0.5rem 0.4rem;
      text-decoration: none;
      transition: background-color 0.2s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-item:hover {
      background: #28283C;
    }

    .panel-title {
      color: #FFFFFF;
      font-weight: 600;
    }

    .panel-metric {
      color: #9CA3AF;
      font-size: 0.85rem;
    }
  `
})
export class DiscoveryItemComponent {
  readonly title = input.required<string>();
  readonly items = input.required<ReadonlyArray<DiscoveryItem>>();

  protected readonly headingId = computed(() => `panel-${this.title().toLowerCase().replace(/\s+/g, '-')}`);
}
