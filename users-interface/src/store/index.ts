import {
  localStorageGetId,
  localStorageSetId,
} from "@/utils/local-storage-helpers";
import { create } from "zustand";

type Store = {
  userId: string;
  setUserId: (userIdP: string) => void;
};

export const useStore = create<Store>()((set) => ({
    userId: localStorageGetId() ?? "",
    setUserId: (userIdP: string) => {
    set(() => ({ userId: userIdP }));
    localStorageSetId(userIdP);
  },
}));
