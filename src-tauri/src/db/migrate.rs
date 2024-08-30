use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrate() -> Vec<tauri_plugin_sql::Migration> {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_ledger_table",
            sql: "CREATE TABLE ledgers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,   -- 账本名称
                note TEXT,            -- 备注
                created_at DATETIME DEFAULT (datetime('now', 'localtime')),  -- 创建时间
                updated_at DATETIME DEFAULT (datetime('now', 'localtime'))   -- 更新时间
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_bill_table",
            sql: "CREATE TABLE bills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ledger_id INTEGER,       -- 对应的账本 ID
                parent_bill_id INTEGER,  -- 如果是子账单，指向父账单
                name TEXT NOT NULL,      -- 收支名称
                type INTEGER CHECK(type IN (1, 2)), -- 支出1,收入2
                amount REAL NOT NULL,    -- 收支金额
                date DATETIME NOT NULL,  -- 收支日期
                note TEXT,               -- 备注
                file_path TEXT,          -- 上传文件路径
                created_at DATETIME DEFAULT (datetime('now', 'localtime')),   -- 创建时间
                updated_at DATETIME DEFAULT (datetime('now', 'localtime')),   -- 更新时间
                FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_bill_id) REFERENCES bills(id) ON DELETE CASCADE
            );",
            kind: MigrationKind::Up,
        },
    ];
    migrations
}
