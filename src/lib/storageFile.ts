import {
  BaseDirectory,
  exists,
  mkdir,
  writeFile,
  remove,
} from "@tauri-apps/plugin-fs";
import { appLocalDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { v4 as uuidv4 } from "uuid";

const storageFilesPath = "files";

export enum StorageKey {
  Ledger = "LEDGER",
  Bill = "BILL",
}

const preflightCheckStorageFold = async (ledgerId: string) => {
  const isExistRoot = await exists(storageFilesPath, {
    baseDir: BaseDirectory.AppLocalData,
  });
  if (!isExistRoot) {
    await mkdir(storageFilesPath, {
      baseDir: BaseDirectory.AppLocalData,
      recursive: true,
    });
  }

  const targetFilePath = `${storageFilesPath}/${ledgerId}`;
  const isExistLedgerFile = await exists(targetFilePath, {
    baseDir: BaseDirectory.AppLocalData,
  });

  if (!isExistLedgerFile) {
    await mkdir(targetFilePath, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }
};

export const saveFileByLedgerId = async (file: File, ledgerId: string) => {
  await preflightCheckStorageFold(ledgerId);

  const realFileName = `${uuidv4()}.${file.name.split(".").at(-1)}`;

  const arrayBuffer = await file.arrayBuffer();
  await writeFile(
    `${storageFilesPath}/${ledgerId}/${realFileName}`,
    new Uint8Array(arrayBuffer),
    { baseDir: BaseDirectory.AppLocalData }
  );

  return `${ledgerId}/${realFileName}`;
};

export const saveFilesByLedgerId = async (files: File[], ledgerId: string) => {
  await preflightCheckStorageFold(ledgerId);

  const fileNames = [];

  for await (const file of files) {
    const realFileName = `${uuidv4()}.${file.name.split(".").at(-1)}`;

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(
      `${storageFilesPath}/${ledgerId}/${realFileName}`,
      new Uint8Array(arrayBuffer),
      { baseDir: BaseDirectory.AppLocalData }
    );

    fileNames.push(`${ledgerId}/${realFileName}`);
  }
  return fileNames;
};

export const getStorageFilePath = async (fileName: string) => {
  let localDataDir = await appLocalDataDir();
  const filePath = await join(localDataDir, "files", fileName);
  return convertFileSrc(filePath);
};

export const removeStorageFoldByLedgerId = async (ledgerId: string) => {
  const filePath = await join("files", ledgerId);
  const isExist = await exists(filePath, {
    baseDir: BaseDirectory.AppLocalData,
  });
  if (isExist) {
    await remove(filePath, {
      baseDir: BaseDirectory.AppLocalData,
      recursive: true,
    });
  }
};

export const removeStorageFile = async (fileName: string) => {
  const filePath = await join("files", fileName);
  const isExist = await exists(filePath, {
    baseDir: BaseDirectory.AppLocalData,
  });
  if (isExist) {
    await remove(filePath, { baseDir: BaseDirectory.AppLocalData });
  }
};

export const removeStorageFileBatch = (fileName: string[]) => {
  fileName.forEach((file) => {
    removeStorageFile(file);
  });
};
