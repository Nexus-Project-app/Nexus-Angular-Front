import { ChangeDetectionStrategy, Component } from '@angular/core';

export interface FooterLink {
  readonly text: string;
  readonly href: string;
}

@Component({
  selector: 'app-footer-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="right-footer" aria-label="Liens secondaires">
      @for (link of FOOTER_LINKS; track link.text) {
        <a [href]="link.href">{{ link.text }}</a>
      }
      <small>{{ COPYRIGHT }}</small>
    </footer>
  `,
  styles: `
    .right-footer {
      color: color-mix(in srgb, var(--nexus-text-secondary) 60%, transparent);
      display: flex;
      flex-wrap: wrap;
      font-size: 0.75rem;
      gap: 0.75rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--nexus-border);
    }

    .right-footer a {
      color: var(--nexus-text-secondary);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .right-footer a:hover {
      color: var(--nexus-text-primary);
    }
  `,
})
export class FooterLinksComponent {
  protected readonly FOOTER_LINKS: ReadonlyArray<FooterLink> = [
    { text: "Conditions d'utilisation", href: '#' },
    { text: 'Politique de Confidentialité', href: '/policy' },
    { text: 'À propos', href: '#' },
    { text: 'Cookies', href: '#' },
  ];

  protected readonly COPYRIGHT = 'Nexus © 2026';
}
