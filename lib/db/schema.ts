// lib/db/schema.ts
import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  text,
  json,
  boolean,
  int,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// --- ENUMS ---
export const userRoleEnum = mysqlEnum("user_role", [
  "SOCIETY_HEAD",
  "SOCIETY_MEMBER",
  "MODERATOR",
]);
export const accountStatusEnum = mysqlEnum("account_status", [
  "PENDING",
  "ACTIVE",
  "REJECTED",
]);
export const eventStatusEnum = mysqlEnum("event_status", [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]);

// ADDED: Restricts the club type to only these two options
export const clubTypeEnum = mysqlEnum("club_type", ["TECHNICAL", "CULTURAL"]);

// --- USERS TABLE ---
export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  
  // CHANGED: Default to the lowest privilege level
  role: userRoleEnum.default("SOCIETY_MEMBER").notNull(),
  
  designation: varchar("designation", { length: 255 }), 
  status: accountStatusEnum.default("PENDING").notNull(),
  
  // Note: For Society Heads, this is the club they are CREATING. 
  // For Society Members, this is the club they are JOINING.
  clubId: varchar("club_id", { length: 255 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// --- CLUBS TABLE ---
export const clubs = mysqlTable("club", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  logoUrl: varchar("logo_url", { length: 255 }),

  // ADDED: The strict categorization for the club
  type: clubTypeEnum.notNull(), 

  // Kept: Stored as a JSON array of strings for specific tags: e.g., '["DSA", "Gaming"]'
  categories: json("categories"),

  // Social Links
  instagram: varchar("instagram", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  youtube: varchar("youtube", { length: 255 }),
  website: varchar("website", { length: 255 }),
  linktree: varchar("linktree", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// --- MEMBERS TABLE ---
export const members = mysqlTable("member", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  designation: varchar("designation", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),

  clubId: varchar("club_id", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// --- EVENTS TABLE ---
export const events = mysqlTable("event", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  coverImageUrl: varchar("cover_image_url", { length: 255 }),

  // Date and Time
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),

  // Location
  venue: varchar("venue", { length: 255 }),
  isOnline: boolean("is_online").default(false).notNull(),
  meetingLink: varchar("meeting_link", { length: 255 }),

  // Registration
  registrationLink: varchar("registration_link", { length: 255 }),
  registrationDeadline: timestamp("registration_deadline"),
  maxCapacity: int("max_capacity"),

  status: eventStatusEnum.default("UPCOMING").notNull(),

  organizerId: varchar("organizer_id", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// --- RELATIONS (For efficient fetching) ---

export const clubsRelations = relations(clubs, ({ many }) => ({
  members: many(members),
  events: many(events),
  users: many(users), 
}));

export const membersRelations = relations(members, ({ one }) => ({
  club: one(clubs, {
    fields: [members.clubId],
    references: [clubs.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  organizer: one(clubs, {
    fields: [events.organizerId],
    references: [clubs.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  club: one(clubs, {
    fields: [users.clubId],
    references: [clubs.id],
  }),
}));