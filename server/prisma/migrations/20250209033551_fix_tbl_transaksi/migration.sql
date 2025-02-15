/*
  Warnings:

  - Made the column `sub_total` on table `Transaksi` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_diskon` on table `Transaksi` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total` on table `Transaksi` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `sub_total` to the `Transaksi_Detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaksi" ALTER COLUMN "sub_total" SET NOT NULL,
ALTER COLUMN "total_diskon" SET NOT NULL,
ALTER COLUMN "total" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaksi_Detail" ADD COLUMN     "sub_total" MONEY NOT NULL;
