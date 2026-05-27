import { CanDeactivateFn } from '@angular/router';
import { EditorPageComponent } from './components/editor-page/editor-page.component';

export const editorDeactivateGuard: CanDeactivateFn<EditorPageComponent> = (component) =>
  component.canDeactivate();
