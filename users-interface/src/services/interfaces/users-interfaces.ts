export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface loginUserDto {
  email: string;
  password: string;
}

export interface loginResponseDto {
  accessToken: string;
  id: string;
  message: string;
}

export interface deleteUserResponse {
  deleteUser: boolean;
  message: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password_bcrypt: string;
  creationDate: Date;
}
