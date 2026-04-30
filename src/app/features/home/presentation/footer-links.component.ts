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
      color: rgba(156, 163, 175, 0.6);
      display: flex;
      flex-wrap: wrap;
      font-size: 0.75rem;
      gap: 0.75rem;
      padding-top: 0.5rem;
      border-top: 1px solid #28283C;
    }

    .right-footer a {
      color: #9CA3AF;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .right-footer a:hover {
      color: #FFFFFF;
    }
  `
})
export class FooterLinksComponent {
  protected readonly FOOTER_LINKS: ReadonlyArray<FooterLink> = [
    { text: 'Conditions d\'utilisation', href: '#' },
    { text: 'Politique de Confidentialité', href: '/policy' },
    { text: 'À propos', href: '#' },
    { text: 'Cookies', href: '#' }
  ];

  protected readonly COPYRIGHT = 'Nexus © 2026';
}
