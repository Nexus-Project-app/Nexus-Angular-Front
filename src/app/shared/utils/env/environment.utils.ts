import { environment } from './environment';

export class EnvironmentUtils {
  static isProduction(): boolean {
    return environment.production;
  }

  static isDevelopment(): boolean {
    return !environment.production;
  }
}
