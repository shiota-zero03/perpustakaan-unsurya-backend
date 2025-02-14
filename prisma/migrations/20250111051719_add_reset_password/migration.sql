/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `refreshToken`,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpires` DATETIME(3) NULL;
