import { dbs } from "@/store";
import {
  CreateUserDto,
  deleteUserResponse,
  loginResponseDto,
  loginUserDto,
  UpdateUserDto,
  User,
} from "../interfaces/users-interfaces";

const MONGO_URL = process.env.MONGO_URL;
const MSSQL_URL = process.env.MSSQL_URL;

var usersUrl = "";

if ( MONGO_URL && MSSQL_URL) {
  if (dbs === "mongo") {
    usersUrl = MONGO_URL + "/users";
  } else {
    usersUrl = MSSQL_URL + "/users";
  }
}

export const fetchAllUsers = async (token: string): Promise<{
  status: number;
  data: User[] | null;
}> => {

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(usersUrl, {
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
  const url = `${usersUrl}/${id}`;

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

  try {
    const response = await fetch(usersUrl, {
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
  const url = `${usersUrl}/${id}`;

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
  const url = `${usersUrl}/loginUser`;

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
  const url = `${usersUrl}/${id}`;

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
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
