import Database from '@tauri-apps/plugin-sql';
import { format } from 'date-fns';
import { bills, ledgers } from './schema';
import { getDrizzleSqliteDB } from './index';

const BaseSeedData = [
  {
    name: '装修消费',
    note: '2024年8月开始装修，预计12月装修结束',
    bills: [
      {
        name: '预计投入20万',
        type: 2,
        amount: 200000,
        note: `从备用金中取出`,
        date: format(new Date('2024-08-03'), 'yyyy-MM-dd HH:mm:ss'),
        isInstallment: 0,
      },
      {
        name: '家装公司设计费用',
        type: 1,
        amount: 120000,
        note: `分三期付款`,
        date: format(new Date('2024-08-22'), 'yyyy-MM-dd HH:mm:ss'),
        isInstallment: 1,
        subBills: [
          {
            name: '定金',
            type: 1,
            amount: 30000,
            note: `已经出完设计图了`,
            date: format(new Date('2024-08-26'), 'yyyy-MM-dd HH:mm:ss'),
            isInstallment: 0,
          },
          {
            name: '第二笔付款',
            type: 1,
            amount: 50000,
            note: ``,
            date: format(new Date('2024-10-15'), 'yyyy-MM-dd HH:mm:ss'),
            isInstallment: 0,
          },
          {
            name: '尾款',
            type: 1,
            amount: 40000,
            note: ``,
            date: format(new Date('2024-11-10'), 'yyyy-MM-dd HH:mm:ss'),
            isInstallment: 0,
          },
        ],
      },
      {
        name: '一些杂七杂八的支出预估',
        type: 1,
        amount: 7500,
        note: ``,
        date: format(new Date('2024-10-21'), 'yyyy-MM-dd HH:mm:ss'),
        isInstallment: 0,
      },
      {
        name: '电视机',
        type: 1,
        amount: 5500,
        note: ``,
        date: format(new Date('2024-11-02'), 'yyyy-MM-dd HH:mm:ss'),
        isInstallment: 0,
      },
      {
        name: '冰箱',
        type: 1,
        amount: 3600,
        note: ``,
        date: format(new Date('2024-11-03'), 'yyyy-MM-dd HH:mm:ss'),
        isInstallment: 0,
      },
      {
        name: '洗烘套装',
        type: 1,
        amount: 8000,
        note: `双十一打折`,
        date: format(new Date('2024-11-11'), 'yyyy-MM-dd HH:mm:ss'),
        isInstallment: 0,
      },
    ],
  },
  {
    name: '和小明大额来往记录',
    note: '',
  },
  {
    name: '工程项目',
    note: '工程项目数据记录，包含了各类工程合同收支、材料采购费用、人工支出、设备租赁、设备维护、差旅费用、施工许可费等相关流水，用于跟踪项目资金状况和成本控制',
    bills: Array(50)
      .fill(null)
      .map((_, index) => {
        const isIncome = Math.random() > 0.6; // 40% 概率是支出
        const isInstallment = Math.random() > 0.7; // 30% 概率是分期
        const baseDate = new Date('2024-01-01');
        const randomDays = Math.floor(Math.random() * 365);
        const date = new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000);

        const incomeTypes = [
          '工程合同款',
          '设备租赁收入',
          '质保金返还',
          '工程变更追加',
          '材料差价返还',
        ];

        const expenseTypes = [
          '材料采购',
          '人工费用',
          '设备维护',
          '办公支出',
          '差旅费用',
          '施工许可费',
        ];

        const baseAmount = isIncome
          ? Math.floor(Math.random() * 500000 + 100000) // 收入 10-60万
          : Math.floor(Math.random() * 100000 + 10000); // 支出 1-11万

        const baseBill = {
          name: isIncome
            ? `${incomeTypes[Math.floor(Math.random() * incomeTypes.length)]}${index + 1}`
            : `${expenseTypes[Math.floor(Math.random() * expenseTypes.length)]}${index + 1}`,
          type: isIncome ? 2 : 1,
          amount: baseAmount,
          note: isIncome ? '项目相关收入' : '项目相关支出',
          date: format(date, 'yyyy-MM-dd HH:mm:ss'),
          isInstallment: isInstallment ? 1 : 0,
        };

        if (isInstallment) {
          return {
            ...baseBill,
            subBills: Array(Math.floor(Math.random() * 19) + 1) // 随机生成1-20条
              .fill(null)
              .map((_, subIndex, array) => {
                const subDate = new Date(date.getTime() + subIndex * 30 * 24 * 60 * 60 * 1000);

                // 计算每期金额
                const installmentCount = array.length;
                const averageAmount = Math.floor(baseAmount / installmentCount);
                const subAmount =
                  subIndex === array.length - 1
                    ? baseAmount - averageAmount * (installmentCount - 1) // 最后一期付清剩余金额
                    : averageAmount;

                return {
                  name: `${baseBill.name}-第${subIndex + 1}笔`,
                  type: baseBill.type,
                  amount: subAmount,
                  note: `第${subIndex + 1}期付款`,
                  date: format(subDate, 'yyyy-MM-dd HH:mm:ss'),
                  isInstallment: 0,
                };
              }),
          };
        }

        return baseBill;
      }),
  },
];

const createSeedData = async (
  db: ReturnType<typeof getDrizzleSqliteDB>,
  seedData: typeof SeedData
) => {
  for (const { name, note, bills: billList } of seedData) {
    const ledgerRes = await db.insert(ledgers).values({ name, note });

    const ledgerId = ledgerRes.lastInsertId;

    for (const { subBills, ...billFirst } of billList || []) {
      const billRes = await db.insert(bills).values({ ...billFirst, ledgerId });
      const billId = billRes.lastInsertId;
      for (const bill of subBills || []) {
        await db.insert(bills).values({ ...bill, ledgerId, parentBillId: billId });
      }
    }
  }
};

const resetDB = async (db: ReturnType<typeof getDrizzleSqliteDB>, sqliteDB: Database) => {
  await db.delete(ledgers);
  await db.delete(bills);
  // 重置自增id
  await sqliteDB.execute('UPDATE sqlite_sequence SET seq = 0');
};

export const runPreviewSeed = async () => {
  const sqliteDB = await Database.load('sqlite:test.db');
  const db = getDrizzleSqliteDB(sqliteDB);

  await resetDB(db, sqliteDB);
  await createSeedData(db, BaseSeedData);
};

export const runTestSeed = async () => {
  const sqliteDB = await Database.load('sqlite:test.db');
  const db = getDrizzleSqliteDB(sqliteDB);

  await resetDB(db, sqliteDB);
  await createSeedData(db, [
    ...BaseSeedData,
    ...Array(100)
      .fill(null)
      .map((_, index) => ({
        name: `测试数据${index + 1}`,
        note: `测试数据${index + 1}`,
      })),
  ]);
};
