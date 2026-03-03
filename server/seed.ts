import "dotenv/config";
import { storage } from "./storage";
import { hashPassword } from "./auth";

async function seed() {
    console.log("Seeding admin users...");

    const admins = [
        { name: "Ahmed", email: "ahmed@airbliss.com", password: "password123", role: "ADMIN" },
        { name: "Mohammed", email: "mohammed@airbliss.com", password: "password456", role: "ADMIN" },
        { name: "Amr", email: "amr@airbliss.com", password: "password789", role: "ADMIN" },
    ];

    for (const admin of admins) {
        const existing = await storage.getUserByEmail(admin.email);
        if (!existing) {
            const hashedPassword = await hashPassword(admin.password);
            await storage.createUser({
                ...admin,
                password: hashedPassword,
            });
            console.log(`Created admin: ${admin.name} (${admin.email})`);
        } else {
            console.log(`Admin ${admin.name} already exists.`);
        }
    }

    console.log("Seeding complete.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
