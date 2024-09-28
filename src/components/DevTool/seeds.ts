import Database from "@tauri-apps/plugin-sql";
import { LedgerDTO } from "@/infrastructure/ledger/type";
import { format } from "date-fns";

export const test_db = await Database.load("sqlite:test.db");

const clearAllData = async () => {
  await test_db.execute("DELETE FROM ledgers");
  await test_db.execute("DELETE FROM bills");
};

const insertLedgers = async (data: [string, string]) => {
  await test_db.execute(
    "INSERT into ledgers (name, note) VALUES ($1, $2)",
    data
  );
};

const insertBills = async (
  data: [number, string, 1 | 2, number, string, string, 0 | 1]
) => {
  await test_db.execute(
    "INSERT into bills (ledger_id, name, type, amount, note, date, is_installment) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    data
  );
};

const setLedgers = async () => {
  await insertLedgers([
    "测试账本一号",
    "这是第一个测试账本，里面放置了少量的账单数据",
  ]);
  await insertLedgers([
    "测试账本二号空数据",
    "这是第二个测试账本，里面的数据是空的",
  ]);
  await insertLedgers([
    "测试账本三号大量数据-三号大量数据-三号大量数据-三号大量数据",
    "这是第三个测试账本，里面放置了大量的账单数据",
  ]);
};

const setBills = async (
  ledgerId: number,
  inCount: number,
  outCount: number
) => {
  for (let i = 0; i < inCount; i++) {
    await insertBills([
      ledgerId,
      `收入${i + 1}`,
      1,
      100,
      `收入${i + 1}备注`,
      format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      0,
    ]);
  }
  for (let i = 0; i < outCount; i++) {
    await insertBills([
      ledgerId,
      `支出${i + 1}`,
      2,
      100,
      `支出${i + 1}备注`,
      format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      0,
    ]);
  }
};

export const resetAndInit = async () => {
  await clearAllData();
  await setLedgers();

  const res = await test_db.select<LedgerDTO[]>("SELECT * from ledgers");

  const less = res.find((item) => item.note?.includes("少量"));
  if (less) {
    await setBills(less.id, 2, 2);
  }

  const more = res.find((item) => item.note?.includes("大量"));
  if (more) {
    await setBills(more.id, 50, 50);
  }
};
