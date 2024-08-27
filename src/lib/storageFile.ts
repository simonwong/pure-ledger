import {
  BaseDirectory,
  exists,
  createDir,
  writeBinaryFile,
  removeFile,
  removeDir,
} from "@tauri-apps/api/fs";
import { appLocalDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { v4 as uuidv4 } from "uuid";

const storageFilesPath = "files";

export enum StorageKey {
  Ledger = "LEDGER",
  Bill = "BILL",
}

const preflightCheckStorageFold = async (ledgerId: string) => {
  const isExistRoot = await exists(storageFilesPath, {
    dir: BaseDirectory.AppLocalData,
  });
  if (!isExistRoot) {
    await createDir(storageFilesPath, {
      dir: BaseDirectory.AppLocalData,
      recursive: true,
    });
  }

  const targetFilePath = `${storageFilesPath}/${ledgerId}`;
  const isExistLedgerFile = await exists(targetFilePath, {
    dir: BaseDirectory.AppLocalData,
  });

  if (!isExistLedgerFile) {
    await createDir(targetFilePath, {
      dir: BaseDirectory.AppLocalData,
    });
  }
};

export const saveFileByLedgerId = async (file: File, ledgerId: string) => {
  await preflightCheckStorageFold(ledgerId);

  const realFileName = `${uuidv4()}.${file.name.split(".").at(-1)}`;

  const arrayBuffer = await file.arrayBuffer();
  await writeBinaryFile(
    `${storageFilesPath}/${ledgerId}/${realFileName}`,
    new Uint8Array(arrayBuffer),
    { dir: BaseDirectory.AppLocalData }
  );

  return `${ledgerId}/${realFileName}`;
};

export const saveFilesByLedgerId = async (files: File[], ledgerId: string) => {
  await preflightCheckStorageFold(ledgerId);

  const fileNames = [];

  for await (const file of files) {
    const realFileName = `${uuidv4()}.${file.name.split(".").at(-1)}`;

    const arrayBuffer = await file.arrayBuffer();
    await writeBinaryFile(
      `${storageFilesPath}/${ledgerId}/${realFileName}`,
      new Uint8Array(arrayBuffer),
      { dir: BaseDirectory.AppLocalData }
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
    dir: BaseDirectory.AppLocalData,
  });
  if (isExist) {
    await removeDir(filePath, {
      dir: BaseDirectory.AppLocalData,
      recursive: true,
    });
  }
};

export const removeStorageFile = async (fileName: string) => {
  const filePath = await join("files", fileName);
  const isExist = await exists(filePath, {
    dir: BaseDirectory.AppLocalData,
  });
  if (isExist) {
    await removeFile(filePath, { dir: BaseDirectory.AppLocalData });
  }
};

export const removeStorageFileBatch = (fileName: string[]) => {
  fileName.forEach((file) => {
    removeStorageFile(file);
  });
};
