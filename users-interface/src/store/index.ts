import {
  localStorageGetId,
  localStorageSetId,
  localStorageSetToken,
} from "@/utils/local-storage-helpers";
import { create } from "zustand";

type Store = {
  userId: string;
  setUserId: (userIdP: string) => void;
  token: string;
  setToken: (tokenP: string) => void;
};

export const useStore = create<Store>()((set) => ({
  userId: localStorageGetId() ?? "",
  setUserId: (userIdP: string) => {
    set(() => ({ userId: userIdP }));
    localStorageSetId(userIdP);
  },
  token: "",
  setToken: (tokenP: string) => {
    set(() => ({ token: tokenP }));
    localStorageSetToken(tokenP);
  },
}));

export var dbs = "mongo";
//export var dbs = "mssql";
