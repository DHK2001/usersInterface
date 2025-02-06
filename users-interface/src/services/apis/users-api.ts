import {
  CreateUserDto,
  deleteUserResponse,
  loginResponseDto,
  loginUserDto,
  UpdateUserDto,
  User,
} from "../interfaces/users-interfaces";

const usersUrl = "http://localhost:8083/v1";

export const fetchAllUsers = async (token: string): Promise<{
  status: number;
  data: User[] | null;
}> => {
  const url = `${usersUrl}/users`;

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
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
  token: string,
  id: String
): Promise<{ status: number; data: User | null }> => {
  const url = `${usersUrl}/users/${id}`;

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
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
  token: string,
  id: String,
  user: UpdateUserDto
): Promise<{ status: number; data: User | null }> => {
  const url = `${usersUrl}/users/${id}`;

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
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
  token: string,
  id: String
): Promise<{ status: number; data: deleteUserResponse | null }> => {
  const url = `${usersUrl}/users/${id}`;

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
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
