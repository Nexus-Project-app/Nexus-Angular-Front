import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccessibilityService } from '@shared/services/accessibility.service';
import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Inject at root level so preferences are applied on every page, not just /profile
  private readonly _a11y = inject(AccessibilityService);
  private readonly _theme = inject(ThemeService);
}
