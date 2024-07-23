import {
  BaseDirectory,
  exists,
  writeTextFile,
  readTextFile,
  createDir,
} from "@tauri-apps/api/fs";
import { StateStorage } from "zustand/middleware";

const storageFoldPath = "storage";
const ledgerFilePath = "storage/ledger.json";
const billFilePath = "storage/bill.json";

export enum StorageKey {
  Ledger = "LEDGER",
  Bill = "BILL",
}

// type StorageData<T extends FileType> = T extends FileType.Bill
//   ? BillData
//   : T extends FileType.Ledger
//   ? LedgerData
//   : never;

const getFilePath = (type: StorageKey) => {
  switch (type) {
    case StorageKey.Ledger:
      return ledgerFilePath;
    case StorageKey.Bill:
      return billFilePath;
  }
  throw new Error("Undefined file type: " + type);
};

const preflightCheckStorageFold = async (type: StorageKey) => {
  const isExistFold = await exists(storageFoldPath, {
    dir: BaseDirectory.AppLocalData,
  });

  if (!isExistFold) {
    await createDir(storageFoldPath, {
      dir: BaseDirectory.AppLocalData,
      recursive: true,
    });
  }

  const isExistFile = await exists(getFilePath(type), {
    dir: BaseDirectory.AppLocalData,
  });

  if (!isExistFile) {
    await writeTextFile(getFilePath(type), "null", {
      dir: BaseDirectory.AppLocalData,
    });
  }
};

export const saveStorageData = async (type: StorageKey, dataStr: string) => {
  await preflightCheckStorageFold(type);
  await writeTextFile(getFilePath(type), dataStr, {
    dir: BaseDirectory.AppLocalData,
  });
};

export const getStorageData = async (type: StorageKey) => {
  await preflightCheckStorageFold(type);
  const dataStr = await readTextFile(getFilePath(type), {
    dir: BaseDirectory.AppLocalData,
  });
  return dataStr;
};

export const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrieved");
    return (await getStorageData(name as StorageKey)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "with value", value, "has been saved");
    await saveStorageData(name as StorageKey, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "不支持删除");
  },
};
