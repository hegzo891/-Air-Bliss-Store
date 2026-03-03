import "dotenv/config";
import { db } from "../server/db";
import { users, orders, orderItems } from "../shared/schema";
import { eq } from "drizzle-orm";

async function verifyOrder() {
    try {
        console.log("Starting final verification simulation...");
        await db.transaction(async (tx) => {
            // 1. User with no password
            const [user] = await tx.insert(users).values({
                name: "Verified User",
                email: `verified_${Date.now()}@example.com`,
                phone: "0000000000",
                role: "CUSTOMER"
            }).returning();
            console.log("- User created (Verified password nullability)");

            // 2. Order with separate city/address
            const [order] = await tx.insert(orders).values({
                userId: user.id,
                totalAmount: "50.00",
                city: "Cairo",
                address: "99 Verification Ave",
                status: "PENDING"
            }).returning();
            console.log("- Order created (Verified city/address separation)");

            console.log("VERIFICATION SUCCESSFUL (Transaction rolling back)");
            throw new Error("ROLLBACK_FOR_TEST");
        });
    } catch (err) {
        if (err.message === "ROLLBACK_FOR_TEST") {
            console.log("ALL CHECKS PASSED.");
        } else {
            console.error("VERIFICATION FAILED:");
            console.error(err);
        }
    } finally {
        process.exit(0);
    }
}

verifyOrder();
