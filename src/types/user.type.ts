export interface User {
  id: string;
  email: string;
  fullName: string;
  pushToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  pushToken?: string;
}