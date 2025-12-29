import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  pgEnum,
  decimal,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', [
  'Customer',
  'Provider',
  'Admin',
]);
export const bookingStatusEnum = pgEnum('booking_status', [
  'Pending',
  'Accepted',
  'InProgress',
  'Completed',
  'Cancelled',
  'Rejected',
]);
export const providerStatusEnum = pgEnum('provider_status', [
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'INACTIVE',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  phoneNumber: text('phone_number').unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: userRoleEnum('role').default('Customer').notNull(),
  firebaseUid: text('firebase_uid').unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  address: text('address').notNull(),
  label: text('label').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const serviceCategories = pgTable('service_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').unique().notNull(),
  description: text('description'),
});

export const providerProfiles = pgTable('provider_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  businessName: text('business_name'),
  address: text('address'),
  bio: text('bio'),
  experience: integer('experience').default(0),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),
  status: providerStatusEnum('status').default('PENDING_APPROVAL').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  rejectionReason: text('rejection_reason'),
  categoryId: uuid('category_id').references(() => serviceCategories.id),
  services: text('services').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const providerDocuments = pgTable('provider_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  providerId: uuid('provider_id').references(() => providerProfiles.id).notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // e.g., 'ID', 'Certificate'
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => serviceCategories.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => users.id).notNull(),
  providerId: uuid('provider_id').references(() => users.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  date: timestamp('date').notNull(),
  status: bookingStatusEnum('status').default('Pending').notNull(),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  address: text('address'), // Service location
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id').references(() => bookings.id).notNull(),
  senderId: text('sender_id').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(providerProfiles, {
    fields: [users.id],
    references: [providerProfiles.userId],
  }),
  bookingsAsCustomer: many(bookings, { relationName: 'customerBookings' }),
  bookingsAsProvider: many(bookings, { relationName: 'providerBookings' }),
  addresses: many(userAddresses),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export const providerProfilesRelations = relations(providerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [providerProfiles.userId],
    references: [users.id],
  }),
  category: one(serviceCategories, {
    fields: [providerProfiles.categoryId],
    references: [serviceCategories.id],
  }),
  documents: many(providerDocuments),
}));

export const providerDocumentsRelations = relations(providerDocuments, ({ one }) => ({
  provider: one(providerProfiles, {
    fields: [providerDocuments.providerId],
    references: [providerProfiles.id],
  }),
}));

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
    relationName: 'customerBookings',
  }),
  provider: one(users, {
    fields: [bookings.providerId],
    references: [users.id],
    relationName: 'providerBookings',
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  booking: one(bookings, {
    fields: [chatMessages.bookingId],
    references: [bookings.id],
  }),
}));
