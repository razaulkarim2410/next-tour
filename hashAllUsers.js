// hashAllUsers.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { dbConnect } from "@/lib/dbConnect";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";

async function hashAllUsers() {
  try {
    await dbConnect();

    const users = await User.find({});
    console.log(`Found ${users.length} users. Processing...`);

    for (const user of users) {
      // Skip already hashed passwords
      if (user.password.startsWith("$2b$")) {
        console.log(`Already hashed: ${user.email}`);
        continue;
      }

      const hashed = await bcrypt.hash(user.password, 10);
      user.password = hashed;
      await user.save();

      console.log(`Password hashed for: ${user.email}`);
    }

    console.log("✅ All users processed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error hashing users:", err);
    process.exit(1);
  }
}

hashAllUsers();
