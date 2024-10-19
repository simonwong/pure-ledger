import Database from '@tauri-apps/plugin-sql';
import { LedgerDTO } from '@/infrastructure/ledger/type';
import { format } from 'date-fns';

export const test_db = await Database.load('sqlite:test.db');

const clearAllData = async () => {
  await test_db.execute('DELETE FROM ledgers');
  await test_db.execute('DELETE FROM bills');
};

const insertLedgers = async (data: [string, string]) => {
  return await test_db.execute('INSERT into ledgers (name, note) VALUES ($1, $2)', data);
};

const insertBills = async (data: [number, string, 1 | 2, number, string, string, 0 | 1]) => {
  return await test_db.execute(
    'INSERT into bills (ledger_id, name, type, amount, note, date, is_installment) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    data
  );
};

const insertSubBills = async (
  data: [number, number, string, 1 | 2, number, string, string, 0 | 1]
) => {
  return await test_db.execute(
    'INSERT into bills (ledger_id, parent_bill_id, name, type, amount, note, date, is_installment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    data
  );
};

const setLedgers = async () => {
  await insertLedgers(['测试账本一号', '这是第一个测试账本，里面放置了少量的账单数据']);
  await insertLedgers(['测试账本二号空数据', '这是第二个测试账本，里面的数据是空的']);
  await insertLedgers([
    '测试账本三号大量数据-三号大量数据-三号大量数据-三号大量数据',
    '这是第三个测试账本，里面放置了大量的账单数据',
  ]);
};

const setBills = async (ledgerId: number, inCount: number, outCount: number) => {
  for (let i = 0; i < inCount; i++) {
    await insertBills([
      ledgerId,
      `收入${i + 1}`,
      1,
      100,
      `收入${i + 1}备注`,
      format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
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
      format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      0,
    ]);
  }
};

export const resetAndInit = async () => {
  await clearAllData();
  await setLedgers();

  const res = await test_db.select<LedgerDTO[]>('SELECT * from ledgers');

  const less = res.find((item) => item.note?.includes('少量'));
  if (less) {
    await setBills(less.id, 2, 2);
  }

  const more = res.find((item) => item.note?.includes('大量'));
  if (more) {
    await setBills(more.id, 50, 50);
  }
};

export const resetAndInitShowSeed = async () => {
  await clearAllData();
  const renovate = await insertLedgers(['装修消费', '2024年8月开始装修，预计12月装修结束']);
  await insertLedgers(['和小明大额来往记录', '']);
  await insertLedgers(['工程项目', '']);
  console.log('renovate.lastInsertId', renovate.lastInsertId);
  await insertBills([
    renovate.lastInsertId,
    '预计投入20万',
    2,
    200000,
    `从备用金中取出`,
    format(new Date('2024-08-03'), 'yyyy-MM-dd HH:mm:ss'),
    0,
  ]);
  const instalment = await insertBills([
    renovate.lastInsertId,
    '家装公司设计费用',
    1,
    120000,
    `分三期付款`,
    format(new Date('2024-08-22'), 'yyyy-MM-dd HH:mm:ss'),
    1,
  ]);
  await insertSubBills([
    renovate.lastInsertId,
    instalment.lastInsertId,
    '定金',
    1,
    30000,
    `已经出完设计图了`,
    format(new Date('2024-08-26'), 'yyyy-MM-dd HH:mm:ss'),
    0,
  ]);

  await insertSubBills([
    renovate.lastInsertId,
    instalment.lastInsertId,
    '第二笔付款',
    1,
    50000,
    ``,
    format(new Date('2024-10-15'), 'yyyy-MM-dd HH:mm:ss'),
    0,
  ]);

  // await insertSubBills([
  //   renovate.lastInsertId,
  //   instalment.lastInsertId,
  //   '尾款',
  //   1,
  //   40000,
  //   ``,
  //   format(new Date('2024-11-10'), 'yyyy-MM-dd HH:mm:ss'),
  //   0,
  // ]);
  await insertBills([
    renovate.lastInsertId,
    '一些杂七杂八的支出预估',
    1,
    7500,
    ``,
    format(new Date('2024-10-21'), 'yyyy-MM-dd HH:mm:ss'),
    0,
  ]);
  await insertBills([
    renovate.lastInsertId,
    '电视机',
    1,
    5500,
    ``,
    format(new Date('2024-11-02'), 'yyyy-MM-dd HH:mm:ss'),
    0,
  ]);
  await insertBills([
    renovate.lastInsertId,
    '冰箱',
    1,
    3600,
    ``,
    format(new Date('2024-11-03'), 'yyyy-MM-dd HH:mm:ss'),
    0,
  ]);
  await insertBills([
    renovate.lastInsertId,
    '洗烘套装',
    1,
    8000,
    `双十一打折`,
    format(new Date('2024-11-11'), 'yyyy-MM-dd HH:mm:ss'),
    0,
  ]);
};
