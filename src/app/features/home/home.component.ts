import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-nexus-bg flex items-center justify-center">
      <p class="text-nexus-muted text-sm">Feed — à venir</p>
    </div>
  `,
})
export class HomeComponent {}
