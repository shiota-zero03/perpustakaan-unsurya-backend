/*
  Warnings:

  - You are about to drop the column `created_at` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `access_token` on the `auth_token` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `auth_token` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `auth_token` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `auth_token` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `faculty_id` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `study_program_id` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `valid_until` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `valid_until` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `identity_number` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `reset_token_expires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `visitor` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `visitor` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `visitor` table. All the data in the column will be lost.
  - You are about to drop the `study_program` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identityNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `auth_token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `auth_token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_faculty_id_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_study_program_id_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `study_program` DROP FOREIGN KEY `study_program_faculty_id_fkey`;

-- DropForeignKey
ALTER TABLE `visitor` DROP FOREIGN KEY `Visitor_user_id_fkey`;

-- DropIndex
DROP INDEX `Student_faculty_id_fkey` ON `student`;

-- DropIndex
DROP INDEX `Student_phone_number_key` ON `student`;

-- DropIndex
DROP INDEX `Student_study_program_id_fkey` ON `student`;

-- DropIndex
DROP INDEX `Student_user_id_key` ON `student`;

-- DropIndex
DROP INDEX `User_identity_number_key` ON `user`;

-- DropIndex
DROP INDEX `Visitor_user_id_fkey` ON `visitor`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `created_at`,
    DROP COLUMN `profile_picture`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `auth_token` DROP COLUMN `access_token`,
    DROP COLUMN `created_at`,
    DROP COLUMN `refresh_token`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `accessToken` LONGTEXT NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `refreshToken` LONGTEXT NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `faculty` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `created_at`,
    DROP COLUMN `transaction_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `transactionId` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `created_at`,
    DROP COLUMN `faculty_id`,
    DROP COLUMN `phone_number`,
    DROP COLUMN `profile_picture`,
    DROP COLUMN `study_program_id`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    DROP COLUMN `valid_until`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `facultyId` INTEGER NULL,
    ADD COLUMN `phoneNumber` VARCHAR(20) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `studyProgramId` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD COLUMN `validUntil` DATE NULL;

-- AlterTable
ALTER TABLE `teacher` DROP COLUMN `created_at`,
    DROP COLUMN `profile_picture`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `valid_until`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `validUntil` DATE NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `created_at`,
    DROP COLUMN `deleted_at`,
    DROP COLUMN `identity_number`,
    DROP COLUMN `reset_password_token`,
    DROP COLUMN `reset_token_expires`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `verified_at`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `identityNumber` VARCHAR(191) NULL,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpires` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `visitor` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- DropTable
DROP TABLE `study_program`;

-- CreateTable
CREATE TABLE `StudyProgram` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facultyId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `StudyProgram_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Student_userId_key` ON `Student`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_phoneNumber_key` ON `Student`(`phoneNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `User_identityNumber_key` ON `User`(`identityNumber`);

-- AddForeignKey
ALTER TABLE `StudyProgram` ADD CONSTRAINT `StudyProgram_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_studyProgramId_fkey` FOREIGN KEY (`studyProgramId`) REFERENCES `StudyProgram`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
