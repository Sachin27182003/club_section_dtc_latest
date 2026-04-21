// nuke.ts
import 'dotenv/config';
import mysql from 'mysql2/promise';

async function wipeDatabase() {
  try {
    console.log("💣 Connecting to Aiven to wipe old Prisma tables...");
    
    // Connect directly using your .env URL
    const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

    // Turn off the safety alarm
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    // Drop all the old tables
    await connection.query('DROP TABLE IF EXISTS `Event`, `Club`, `User`, `user`, `_prisma_migrations`;');
    
    // Turn the safety alarm back on
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log("✅ Old tables successfully vaporized!");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Failed to wipe tables:", error);
    process.exit(1);
  }
}

wipeDatabase();