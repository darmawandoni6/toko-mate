/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `Produk` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Produk_barcode_key" ON "Produk"("barcode");
