ALTER TABLE "provider_profiles" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "provider_profiles" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL'::text;--> statement-breakpoint
DROP TYPE "public"."provider_status";--> statement-breakpoint
CREATE TYPE "public"."provider_status" AS ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED');--> statement-breakpoint
ALTER TABLE "provider_profiles" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL'::"public"."provider_status";--> statement-breakpoint
ALTER TABLE "provider_profiles" ALTER COLUMN "status" SET DATA TYPE "public"."provider_status" USING "status"::"public"."provider_status";--> statement-breakpoint
ALTER TABLE "provider_profiles" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;