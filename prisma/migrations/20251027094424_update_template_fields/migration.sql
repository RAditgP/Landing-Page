/*
  Warnings:

  - You are about to drop the column `desc` on the `template` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `template` table. All the data in the column will be lost.
  - Added the required column `description` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `template` DROP COLUMN `desc`,
    DROP COLUMN `imageUrl`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL;
