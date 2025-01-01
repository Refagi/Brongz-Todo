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

export interface RequestLoginUser {
  email: string;
  password: string;
}

export interface RequestVerifyUser {
  id: string;
  username: string;
  email: string;
  password: string;
  age: number;
  isEmailVerified: boolean;
}
