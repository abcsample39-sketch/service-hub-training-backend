ALTER TABLE "bookings" ADD COLUMN "customer_name" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "customer_email" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "customer_phone" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "provider_profiles" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE no action ON UPDATE no action;