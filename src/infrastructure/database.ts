import Database from "@tauri-apps/plugin-sql";

export const db = await Database.load("sqlite:test.db");

export const test_db = await Database.load("sqlite:test.db");
