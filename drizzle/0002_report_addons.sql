CREATE TABLE IF NOT EXISTS `report_addons` (
	`user_id` text NOT NULL,
	`child_id` text NOT NULL,
	`stripe_subscription_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `child_id`)
);
