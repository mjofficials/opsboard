/*
  Warnings:

  - The primary key for the `organization_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `organizations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `created_by` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `assignee_id` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ticket_comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tickets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `assignee_id` column on the `tickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_by` column on the `tickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `organization_members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `organization_members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organization_id` on the `organization_members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `organizations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organization_id` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `ticket_comments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ticket_id` on the `ticket_comments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `ticket_comments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `tickets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `project_id` on the `tickets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_assignee_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_created_by_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_comments" DROP CONSTRAINT "ticket_comments_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_comments" DROP CONSTRAINT "ticket_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_assignee_id_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_created_by_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_project_id_fkey";

-- DropIndex
DROP INDEX "organization_members_user_id_idx";

-- DropIndex
DROP INDEX "ticket_comments_ticket_id_idx";

-- AlterTable
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_pkey",
ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
ALTER COLUMN "user_id" SET DATA TYPE UUID USING "user_id"::uuid,
ALTER COLUMN "organization_id" SET DATA TYPE UUID USING "organization_id"::uuid,
ADD CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_pkey",
ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
ALTER COLUMN "organization_id" SET DATA TYPE UUID USING "organization_id"::uuid,
ALTER COLUMN "created_by" SET DATA TYPE UUID USING "created_by"::uuid,
ALTER COLUMN "assignee_id" SET DATA TYPE UUID USING "assignee_id"::uuid,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ticket_comments" DROP CONSTRAINT "ticket_comments_pkey",
ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
ALTER COLUMN "ticket_id" SET DATA TYPE UUID USING "ticket_id"::uuid,
ALTER COLUMN "user_id" SET DATA TYPE UUID USING "user_id"::uuid,
ADD CONSTRAINT "ticket_comments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_pkey",
ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
ALTER COLUMN "project_id" SET DATA TYPE UUID USING "project_id"::uuid,
ALTER COLUMN "assignee_id" SET DATA TYPE UUID USING "assignee_id"::uuid,
ALTER COLUMN "created_by" SET DATA TYPE UUID USING "created_by"::uuid,
ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
DROP INDEX IF EXISTS "organization_members_organization_id_idx";
CREATE INDEX "organization_members_organization_id_idx" ON "organization_members"("organization_id");

-- CreateIndex
DROP INDEX IF EXISTS "organization_members_user_id_organization_id_key";
CREATE UNIQUE INDEX "organization_members_user_id_organization_id_key" ON "organization_members"("user_id", "organization_id");

-- CreateIndex
DROP INDEX IF EXISTS "organizations_stripe_customer_id_idx";
CREATE INDEX "organizations_stripe_customer_id_idx" ON "organizations"("stripe_customer_id");

-- CreateIndex
DROP INDEX IF EXISTS "projects_status_idx";
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
DROP INDEX IF EXISTS "projects_organization_id_idx";
CREATE INDEX "projects_organization_id_idx" ON "projects"("organization_id");

-- CreateIndex
DROP INDEX IF EXISTS "projects_created_by_idx";
CREATE INDEX "projects_created_by_idx" ON "projects"("created_by");

-- CreateIndex
DROP INDEX IF EXISTS "projects_assignee_id_idx";
CREATE INDEX "projects_assignee_id_idx" ON "projects"("assignee_id");

-- CreateIndex
DROP INDEX IF EXISTS "ticket_comments_ticket_id_created_at_idx";
CREATE INDEX "ticket_comments_ticket_id_created_at_idx" ON "ticket_comments"("ticket_id", "created_at");

-- CreateIndex
DROP INDEX IF EXISTS "ticket_comments_user_id_idx";
CREATE INDEX "ticket_comments_user_id_idx" ON "ticket_comments"("user_id");

-- CreateIndex
DROP INDEX IF EXISTS "tickets_status_idx";
CREATE INDEX "tickets_status_idx" ON "tickets"("status");

-- CreateIndex
DROP INDEX IF EXISTS "tickets_project_id_idx";
CREATE INDEX "tickets_project_id_idx" ON "tickets"("project_id");

-- CreateIndex
DROP INDEX IF EXISTS "tickets_project_id_status_idx";
CREATE INDEX "tickets_project_id_status_idx" ON "tickets"("project_id", "status");

-- CreateIndex
DROP INDEX IF EXISTS "tickets_assignee_id_idx";
CREATE INDEX "tickets_assignee_id_idx" ON "tickets"("assignee_id");

-- CreateIndex
DROP INDEX IF EXISTS "tickets_created_by_idx";
CREATE INDEX "tickets_created_by_idx" ON "tickets"("created_by");

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
