// lib/db/schema.ts
import { mysqlTable, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

// Changed PRESIDENT to CLUB_ADMIN
export const userRoleEnum = mysqlEnum('user_role', ['CLUB_ADMIN', 'MODERATOR']);
export const accountStatusEnum = mysqlEnum('account_status', ['PENDING', 'ACTIVE', 'REJECTED']);

export const users = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  // Default to CLUB_ADMIN now
  role: userRoleEnum.default('CLUB_ADMIN').notNull(),
  status: accountStatusEnum.default('PENDING').notNull(), 
  
  clubId: varchar('club_id', { length: 255 }), 
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 3. Define Club Table (Basic setup)
export const clubs = mysqlTable('club', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
});

// 4. Define Event Table (Basic setup)
export const events = mysqlTable('event', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
});