-- DropForeignKey
ALTER TABLE "Produk" DROP CONSTRAINT "Produk_kategori_id_fkey";

-- DropForeignKey
ALTER TABLE "Stok" DROP CONSTRAINT "Stok_email_fkey";

-- DropForeignKey
ALTER TABLE "Stok" DROP CONSTRAINT "Stok_produk_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_toko_id_fkey";

-- AlterTable
ALTER TABLE "Stok" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaksi_Detail" ALTER COLUMN "diskon_id" DROP NOT NULL,
ALTER COLUMN "diskon_nama" DROP NOT NULL,
ALTER COLUMN "diskon_total" DROP NOT NULL,
ALTER COLUMN "diskon_total" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_toko_id_fkey" FOREIGN KEY ("toko_id") REFERENCES "Toko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stok" ADD CONSTRAINT "Stok_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stok" ADD CONSTRAINT "Stok_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
