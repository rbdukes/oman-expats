import { db } from "./src/lib/db";
import { hash } from "@node-rs/argon2";

async function createAdmin() {
  console.log("Creating admin account...\n");

  const adminEmail = "admin@omanexpat.com";
  const adminPassword = "OmanExpat@2024!";
  const adminFirstName = "Admin";
  const adminLastName = "User";

  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin account already exists!");
      console.log("Updating to ensure admin role...\n");
      
      await db.user.update({
        where: { email: adminEmail },
        data: {
          role: "admin",
          status: "active",
          emailVerified: true,
        },
      });
    } else {
      // Hash the password
      const hashedPassword = await hash(adminPassword, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      // Create admin user
      await db.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstName: adminFirstName,
          lastName: adminLastName,
          displayName: "Administrator",
          role: "admin",
          status: "active",
          emailVerified: true,
        },
      });
    }

    console.log("═══════════════════════════════════════════════════════════");
    console.log("              ADMIN ACCOUNT CREDENTIALS                     ");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");
    console.log("  Email:     admin@omanexpat.com");
    console.log("  Password:  OmanExpat@2024!");
    console.log("");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");
    console.log("⚠️  IMPORTANT: Change this password after first login!");
    console.log("");

  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }

  await db.$disconnect();
}

createAdmin();
