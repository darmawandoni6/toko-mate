/*
  Warnings:

  - Added the required column `toko_id` to the `Diskon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toko_id` to the `Kategori` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toko_id` to the `Produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toko_id` to the `Stok` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toko_id` to the `Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toko_id` to the `Transaksi_Detail` table without a default value. This is not possible if the table is not empty.
  - Made the column `nama` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Diskon" ADD COLUMN     "toko_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Kategori" ADD COLUMN     "toko_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Produk" ADD COLUMN     "toko_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Stok" ADD COLUMN     "toko_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Transaksi" ADD COLUMN     "toko_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Transaksi_Detail" ADD COLUMN     "toko_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nama" SET NOT NULL;
