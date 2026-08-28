CREATE TABLE "transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"from_account_id" uuid NOT NULL,
	"to_account_id" uuid NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"description" varchar(255),
	"transfer_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_account_id_fk" FOREIGN KEY ("from_account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_account_id_fk" FOREIGN KEY ("to_account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "transfers_user_date_idx" ON "transfers" USING btree ("user_id","transfer_date" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "transfers_from_account_idx" ON "transfers" USING btree ("from_account_id");--> statement-breakpoint
CREATE INDEX "transfers_to_account_idx" ON "transfers" USING btree ("to_account_id");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transfer_id_transfers_id_fk" FOREIGN KEY ("transfer_id") REFERENCES "public"."transfers"("id") ON DELETE cascade ON UPDATE cascade;