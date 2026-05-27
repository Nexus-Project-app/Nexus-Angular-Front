export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;

  avatarUrl?: string;

  DateDeCreation: Date;
  DateDeModification: Date;
}
