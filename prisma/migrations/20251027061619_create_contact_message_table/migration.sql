-- CreateTable
CREATE TABLE `PesanKontak` (
    `id` VARCHAR(191) NOT NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `alamatEmail` VARCHAR(191) NOT NULL,
    `pesanAnda` VARCHAR(191) NOT NULL,
    `dibaca` BOOLEAN NOT NULL DEFAULT false,
    `dikirimPada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
