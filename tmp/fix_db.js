import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixSchema() {
    try {
        console.log("Attempting to drop unique constraints and indexes on 'users' table...");

        // Try to drop constraints
        try {
            await pool.query("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique");
            console.log("- Dropped user_email_unique (if it existed)");
        } catch (e) { console.log("- Skip drop constraint user_email_unique"); }

        try {
            await pool.query("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_phone_unique");
            console.log("- Dropped user_phone_unique (if it existed)");
        } catch (e) { console.log("- Skip drop constraint user_phone_unique"); }

        // Try to drop indexes (Drizzle often names them this way)
        try {
            await pool.query("DROP INDEX IF EXISTS users_email_unique_index");
            console.log("- Dropped index users_email_unique_index (if it existed)");
        } catch (e) { console.log("- Skip drop index users_email_unique_index"); }

        try {
            await pool.query("DROP INDEX IF EXISTS users_phone_unique_index");
            console.log("- Dropped index users_phone_unique_index (if it existed)");
        } catch (e) { console.log("- Skip drop index users_phone_unique_index"); }

        // Also check for any index that is UNIQUE and on email/phone
        const res = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'users' AND indexdef LIKE '%UNIQUE%'
    `);

        for (const row of res.rows) {
            if (row.indexname !== 'users_pkey') {
                console.log(`- Dropping unique index: ${row.indexname}`);
                await pool.query(`DROP INDEX IF EXISTS ${row.indexname}`);
            }
        }

        console.log("Making password column nullable...");
        await pool.query("ALTER TABLE users ALTER COLUMN password DROP NOT NULL");
        console.log("- Password column is now nullable");

        console.log("Schema fixed manually!");
        await pool.end();
    } catch (err) {
        console.error("Error fixing schema:", err);
        process.exit(1);
    }
}

fixSchema();
