CREATE TABLE `achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`label` text NOT NULL,
	`description` text NOT NULL,
	`icon` text DEFAULT '⭐' NOT NULL,
	`earned_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `children` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`interests` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` text PRIMARY KEY NOT NULL,
	`referrer_user_id` text NOT NULL,
	`referred_email` text NOT NULL,
	`referred_user_id` text,
	`referral_code` text NOT NULL,
	`status` text DEFAULT 'sent' NOT NULL,
	`created_at` integer NOT NULL,
	`rewarded_at` integer
);
--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `stripe_price_id` text;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `cancel_at_period_end` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `extended_questions` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `stripe_addon_subscription_id` text;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `addon_status` text DEFAULT 'inactive' NOT NULL;