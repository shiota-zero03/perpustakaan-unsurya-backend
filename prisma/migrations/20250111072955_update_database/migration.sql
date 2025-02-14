/*
  Warnings:

  - You are about to drop the column `createdAt` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `auth_token` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `auth_token` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `facultyId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `studyProgramId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `validUntil` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `validUntil` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `identityNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `visitor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `visitor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `visitor` table. All the data in the column will be lost.
  - You are about to drop the `studyprogram` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identity_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_facultyId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_studyProgramId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_userId_fkey`;

-- DropForeignKey
ALTER TABLE `studyprogram` DROP FOREIGN KEY `StudyProgram_facultyId_fkey`;

-- DropForeignKey
ALTER TABLE `visitor` DROP FOREIGN KEY `Visitor_userId_fkey`;

-- DropIndex
DROP INDEX `Student_facultyId_fkey` ON `student`;

-- DropIndex
DROP INDEX `Student_phoneNumber_key` ON `student`;

-- DropIndex
DROP INDEX `Student_studyProgramId_fkey` ON `student`;

-- DropIndex
DROP INDEX `Student_userId_key` ON `student`;

-- DropIndex
DROP INDEX `User_identityNumber_key` ON `user`;

-- DropIndex
DROP INDEX `Visitor_userId_fkey` ON `visitor`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `createdAt`,
    DROP COLUMN `profilePicture`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `profile_picture` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `auth_token` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `faculty` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `createdAt`,
    DROP COLUMN `transactionId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `transaction_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `createdAt`,
    DROP COLUMN `facultyId`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `profilePicture`,
    DROP COLUMN `studyProgramId`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    DROP COLUMN `validUntil`,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `faculty_id` INTEGER NULL,
    ADD COLUMN `phone_number` VARCHAR(20) NULL,
    ADD COLUMN `profile_picture` VARCHAR(191) NULL,
    ADD COLUMN `study_program_id` INTEGER NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD COLUMN `valid_until` DATE NULL;

-- AlterTable
ALTER TABLE `teacher` DROP COLUMN `createdAt`,
    DROP COLUMN `profilePicture`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `validUntil`,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `profile_picture` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL,
    ADD COLUMN `valid_until` DATE NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `identityNumber`,
    DROP COLUMN `resetPasswordToken`,
    DROP COLUMN `resetTokenExpires`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `verifiedAt`,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `identity_number` VARCHAR(191) NULL,
    ADD COLUMN `reset_password_token` VARCHAR(191) NULL,
    ADD COLUMN `reset_token_expires` DATETIME(3) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL,
    ADD COLUMN `verified_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `visitor` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NULL,
    ADD COLUMN `user_id` INTEGER NULL;

-- DropTable
DROP TABLE `studyprogram`;

-- CreateTable
CREATE TABLE `study_program` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `faculty_id` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `study_program_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Student_user_id_key` ON `Student`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_phone_number_key` ON `Student`(`phone_number`);

-- CreateIndex
CREATE UNIQUE INDEX `User_identity_number_key` ON `User`(`identity_number`);

-- AddForeignKey
ALTER TABLE `study_program` ADD CONSTRAINT `study_program_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `Faculty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `Faculty`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_study_program_id_fkey` FOREIGN KEY (`study_program_id`) REFERENCES `study_program`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
