use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrate() -> Vec<tauri_plugin_sql::Migration> {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_ledger_table",
            sql: "create table ledgers (
                id INTEGER primary key autoincrement,
                name TEXT not null,   -- 账本名称
                note TEXT,            -- 备注
                created_at DATETIME default (datetime('now', 'localtime')),  -- 创建时间
                updated_at DATETIME default (datetime('now', 'localtime'))   -- 更新时间
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_bill_table",
            sql: "create table bills (
                id INTEGER primary key autoincrement,
                ledger_id INTEGER,       -- 对应的账本 ID
                parent_bill_id INTEGER,  -- 如果是子账单，指向父账单
                name TEXT not null,      -- 收支名称
                bill_type INTEGER check(bill_type IN (1, 2)), -- 支出1,收入2
                is_installment INTEGER default 0 check(is_installment IN (0,1)), -- 是否分期
                amount REAL not null,    -- 收支金额
                date DATETIME not null,  -- 收支日期
                note TEXT,               -- 备注
                file_path TEXT,          -- 上传文件路径
                created_at DATETIME default (datetime('now', 'localtime')),   -- 创建时间
                updated_at DATETIME default (datetime('now', 'localtime')),   -- 更新时间
                FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_bill_id) REFERENCES bills(id) ON DELETE CASCADE
            );
            create index idx_bills_ledger_id on bills(ledger_id);",
            kind: MigrationKind::Up,
        },
    ];
    migrations
}
