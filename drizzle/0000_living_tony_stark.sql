CREATE TYPE "public"."consent_level" AS ENUM('love', 'like', 'neutral', 'ask', 'ng');--> statement-breakpoint
CREATE TYPE "public"."list_kind" AS ENUM('general', 'adult');--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consensus_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "list_kind" NOT NULL,
	"share_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "consensus_lists_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
CREATE TABLE "custom_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid NOT NULL,
	"label" text NOT NULL,
	"label_key" text NOT NULL,
	"level" "consent_level" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preset_answers" (
	"list_id" uuid NOT NULL,
	"item_key" text NOT NULL,
	"level" "consent_level" NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "preset_answers_list_id_item_key_pk" PRIMARY KEY("list_id","item_key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"handle" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_adult" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consensus_lists" ADD CONSTRAINT "consensus_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_items" ADD CONSTRAINT "custom_items_list_id_consensus_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."consensus_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preset_answers" ADD CONSTRAINT "preset_answers_list_id_consensus_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."consensus_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_sessions_user_idx" ON "auth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "consensus_lists_user_kind_uq" ON "consensus_lists" USING btree ("user_id","kind");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_items_list_label_uq" ON "custom_items" USING btree ("list_id","label_key");