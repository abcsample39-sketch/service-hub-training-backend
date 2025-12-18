CREATE TYPE "public"."provider_status" AS ENUM('Pending', 'Approved', 'Rejected');--> statement-breakpoint
ALTER TABLE "provider_profiles" ADD COLUMN "business_name" text;--> statement-breakpoint
ALTER TABLE "provider_profiles" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "provider_profiles" ADD COLUMN "status" "provider_status" DEFAULT 'Pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "provider_profiles" ADD COLUMN "rejection_reason" text;