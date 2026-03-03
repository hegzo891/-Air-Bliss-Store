import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkAllConstraints() {
    try {
        console.log("--- Comprehensive Check for 'users' table ---");

        console.log("\n1. UNIQUE INDEXES:");
        const indexes = await pool.query(`
      SELECT
        indexname as name,
        indexdef as definition
      FROM pg_indexes
      WHERE tablename = 'users';
    `);
        indexes.rows.forEach(row => {
            const isUnique = row.definition.includes('UNIQUE');
            console.log(`- ${row.name}: ${isUnique ? 'UNIQUE' : 'NON-UNIQUE'} (${row.definition})`);
        });

        console.log("\n2. CONSTRAINTS (Unique, Check, Primary, etc.):");
        const constraints = await pool.query(`
      SELECT
        conname as name,
        contype as type,
        pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = 'users'::regclass;
    `);
        constraints.rows.forEach(row => {
            console.log(`- ${row.name} [Type: ${row.type}]: ${row.definition}`);
        });

        console.log("\n3. COLUMN TYPES AND NULLABILITY:");
        const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
        columns.rows.forEach(row => {
            console.log(`- ${row.column_name} (${row.data_type}, Nullable: ${row.is_nullable})`);
        });

        await pool.end();
    } catch (err) {
        console.error("Error during comprehensive check:", err);
        process.exit(1);
    }
}

checkAllConstraints();
