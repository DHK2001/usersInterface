import {
  CreateUserDto,
  deleteUserResponse,
  loginResponseDto,
  loginUserDto,
  UpdateUserDto,
  User,
} from "../interfaces/users-interfaces";

const usersUrl = "http://localhost:8083/v1";

export const fetchAllUsers = async (): Promise<{
  status: number;
  data: User[] | null;
}> => {
  const url = `${usersUrl}/users`;
  const tokenAccess =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4OTQxNjM4LTQ4REYtRUYxMS04OEY4LTYwNDVCRERCQjI2NSIsImVtYWlsIjoicGFibGl0b0BleGFtcGxlLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEyJGRtaWl6YmVGTW9mS0lUMlNFWERLM09ESHRBTWRGYVEvYVF4ZEczSjd0RUxULjNZajVTTXpDIiwiaWF0IjoxNzM4NjgzNTQwLCJleHAiOjE3Mzg2ODcxNDB9.5qckZwWaW7AgPya_QR30C-jVXJgcLZFKrwuRzyZ2xZw";

  if (!tokenAccess) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": tokenAccess,
      },
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const fetchIdUser = async (
  id: String
): Promise<{ status: number; data: User | null }> => {
  const url = `${usersUrl}/users/${id}`;
  const tokenAccess = "";

  if (!tokenAccess) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": tokenAccess,
      },
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const createUser = async (
  user: CreateUserDto
): Promise<{ status: number; data: User | null }> => {
  const url = `${usersUrl}/users`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const updateUser = async (
  id: String,
  user: UpdateUserDto
): Promise<{ status: number; data: User | null }> => {
  const url = `${usersUrl}/users/${id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const loginUser = async (
  user: loginUserDto
): Promise<{ status: number; data: loginResponseDto | null }> => {
  const url = `${usersUrl}/users/loginUser`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const deleteUser = async (
  id: String
): Promise<{ status: number; data: deleteUserResponse | null }> => {
  const url = `${usersUrl}/users/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

//http://localhost:8083/v1/users
