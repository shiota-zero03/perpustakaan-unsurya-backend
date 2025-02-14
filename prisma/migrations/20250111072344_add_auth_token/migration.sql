-- CreateTable
CREATE TABLE `auth_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `access_token` LONGTEXT NOT NULL,
    `refresh_token` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
