CREATE TABLE "employees" (
	"id" serial PRIMARY KEY,
	"profile_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_records" (
	"id" serial PRIMARY KEY,
	"profile_id" text NOT NULL,
	"dest_id" text NOT NULL,
	"start_date" text NOT NULL,
	"ref" text NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"paid_at" text NOT NULL,
	"is_paid" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY,
	"company_name" text DEFAULT '' NOT NULL,
	"industry" text DEFAULT '' NOT NULL,
	"hr_email" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trip_plans" (
	"id" text PRIMARY KEY,
	"profile_id" text NOT NULL,
	"dest" text NOT NULL,
	"dest_id" text DEFAULT '' NOT NULL,
	"dest_emoji" text DEFAULT '✈️' NOT NULL,
	"route" text DEFAULT '' NOT NULL,
	"days" integer DEFAULT 1 NOT NULL,
	"start_date" text DEFAULT '' NOT NULL,
	"team_size" integer DEFAULT 10 NOT NULL,
	"sent_to" integer DEFAULT 0 NOT NULL,
	"day_plans" jsonb,
	"route_details" jsonb,
	"company" text DEFAULT '' NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_plans" ADD CONSTRAINT "trip_plans_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;