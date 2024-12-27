export interface RequestCreateUser {
  username: string;
  email: string;
  password: string;
  age: number;
}

export interface ResquestUpdateUser {
  username?: string;
  email?: string;
  password?: string;
  age?: number;
  isEmailVerified?: boolean;
  updatedAt?: Date;
}
