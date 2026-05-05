export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserDTO {
  email: string,
  keycloakId: string,
  firstName: string,
  lastName: string
}