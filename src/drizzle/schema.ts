import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  pgEnum,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', [
  'Customer',
  'Provider',
  'Admin',
]);
export const bookingStatusEnum = pgEnum('booking_status', [
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  phoneNumber: text('phone_number').unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: userRoleEnum('role').default('Customer').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const providerStatusEnum = pgEnum('provider_status', [
  'Pending',
  'Approved',
  'Rejected',
]);

export const providerProfiles = pgTable('provider_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  businessName: text('business_name'),
  address: text('address'),
  bio: text('bio'),
  experience: integer('experience').default(0),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),
  status: providerStatusEnum('status').default('Pending').notNull(),
  rejectionReason: text('rejection_reason'),
});

export const serviceCategories = pgTable('service_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').unique().notNull(),
  description: text('description'),
});

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id')
    .references(() => serviceCategories.id)
    .notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration').notNull(), // in minutes
});

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id')
    .references(() => users.id)
    .notNull(),
  providerId: uuid('provider_id').references(() => users.id),
  serviceId: uuid('service_id')
    .references(() => services.id)
    .notNull(),
  date: timestamp('date').notNull(),
  status: bookingStatusEnum('status').default('Pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(providerProfiles, {
    fields: [users.id],
    references: [providerProfiles.userId],
  }),
  bookingsAsCustomer: many(bookings, { relationName: 'customerBookings' }),
  bookingsAsProvider: many(bookings, { relationName: 'providerBookings' }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
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
}));
