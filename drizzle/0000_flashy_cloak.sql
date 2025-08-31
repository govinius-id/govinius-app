CREATE TABLE `role_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role` varchar(100),
	`permissions` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`deleted_at` timestamp,
	CONSTRAINT `role_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255),
	`value` varchar(255),
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`deleted_at` timestamp,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uuid` char(36),
	`name` varchar(255) NOT NULL,
	`username` varchar(255),
	`email` varchar(255),
	`password` char(97) NOT NULL,
	`picture` varchar(255),
	`role` varchar(100),
	`permissions` json DEFAULT ('[]'),
	`is_role_permission_custom` boolean DEFAULT false,
	`is_email_verified` boolean DEFAULT false,
	`is_active` boolean DEFAULT false,
	`reset_password_token` char(64),
	`reset_password_expires` timestamp,
	`email_verification_token` char(64),
	`email_verification_expires` timestamp,
	`email_verified_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `email` ON `users` (`email`);