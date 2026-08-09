CREATE TABLE `interview_evaluations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`question_id` text,
	`score` integer,
	`correctness` integer,
	`relevance` integer,
	`technical_depth` integer,
	`communication` integer,
	`strengths` text,
	`weaknesses` text,
	`missing_concepts` text,
	`assessment` text,
	`created_at` text NOT NULL
);
CREATE TABLE `interview_feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`score` integer NOT NULL,
	`summary` text NOT NULL,
	`technical_knowledge` integer NOT NULL,
	`problem_solving` integer NOT NULL,
	`communication_skills` integer NOT NULL,
	`answer_quality` integer NOT NULL,
	`confidence` integer NOT NULL,
	`strengths` text,
	`weaknesses` text,
	`suggestions` text,
	`created_at` text NOT NULL
);
CREATE TABLE `interview_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`sender` text NOT NULL,
	`text` text NOT NULL,
	`timestamp` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL
);
CREATE TABLE `interviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`role` text NOT NULL,
	`experience_level` text NOT NULL,
	`interview_type` text NOT NULL,
	`question_count` integer NOT NULL,
	`current_question_id` text,
	`current_question_text` text,
	`progress` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
CREATE UNIQUE INDEX `interviews_session_id_unique` ON `interviews` (`session_id`);
CREATE UNIQUE INDEX `interview_feedback_session_id_unique` ON `interview_feedback` (`session_id`);
