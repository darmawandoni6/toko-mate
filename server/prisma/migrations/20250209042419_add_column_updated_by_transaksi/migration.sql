/*
  Warnings:

  - Added the required column `updated_by` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaksi" ADD COLUMN     "updated_by" VARCHAR(100) NOT NULL;
