CREATE TABLE IF NOT EXISTS `seen_questions` (
	`user_id` text NOT NULL,
	`child_id` text NOT NULL,
	`subject` text NOT NULL,
	`question_key` text NOT NULL,
	`sample` text,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `child_id`, `subject`, `question_key`)
);
