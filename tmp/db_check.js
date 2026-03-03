import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkSchema() {
    try {
        const tables = ['users', 'orders', 'order_items', 'inventory', 'inventory_logs'];

        for (const table of tables) {
            console.log(`\n--- Checking ${table} table ---`);
            const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table]);

            if (columns.rows.length === 0) {
                console.log(`Table ${table} NOT FOUND!`);
            } else {
                console.log("Columns:");
                columns.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type}, Nullable: ${row.is_nullable})`));
            }

            const constraints = await pool.query(`
        SELECT conname, contype 
        FROM pg_constraint 
        JOIN pg_class ON pg_class.oid = pg_constraint.conrelid 
        WHERE pg_class.relname = $1
      `, [table]);

            console.log("Constraints:");
            constraints.rows.forEach(row => console.log(`- ${row.conname} (Type: ${row.contype})`));

            const indexes = await pool.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = $1
      `, [table]);

            console.log("Indexes:");
            indexes.rows.forEach(row => console.log(`- ${row.indexname}: ${row.indexdef}`));
        }

        await pool.end();
    } catch (err) {
        console.error("Error checking schema:", err);
        process.exit(1);
    }
}

checkSchema();
