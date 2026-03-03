import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function testDuplicates() {
    const testEmail = `duplicate_test_${Date.now()}@example.com`;
    const testPhone = "0000000000";

    try {
        console.log(`Inserting first user with email: ${testEmail}`);
        await pool.query("INSERT INTO users (name, email, phone, role) VALUES ($1, $2, $3, $4)",
            ["Test 1", testEmail, testPhone, "CUSTOMER"]);
        console.log("First insertion success.");

        console.log(`Inserting second user with SAME email: ${testEmail}`);
        await pool.query("INSERT INTO users (name, email, phone, role) VALUES ($1, $2, $3, $4)",
            ["Test 2", testEmail, testPhone, "CUSTOMER"]);
        console.log("Second insertion success! (Duplicates are allowed)");

    } catch (err) {
        console.error("Insertion FAILED with error:");
        console.error(err);
        if (err.constraint) console.log("Violated constraint:", err.constraint);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

testDuplicates();
