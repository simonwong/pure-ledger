import Database from "@tauri-apps/plugin-sql";

export const db = await Database.load("sqlite:ledger.db");

// export const db = await Database.load("sqlite:test.db");
