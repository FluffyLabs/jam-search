ALTER TABLE "pages"
ADD COLUMN "created_at" timestamp (3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
--> statement-breakpoint