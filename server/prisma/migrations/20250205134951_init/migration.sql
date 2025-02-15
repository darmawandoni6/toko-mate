-- CreateTable
CREATE TABLE "Toko" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "hp" VARCHAR(13) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Toko_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "toko_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produk" (
    "id" UUID NOT NULL,
    "kategori_id" UUID NOT NULL,
    "diskon_id" UUID,
    "barcode" VARCHAR(50) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "harga_beli" MONEY NOT NULL,
    "harga_jual" MONEY NOT NULL,
    "total_stok" INTEGER DEFAULT 0,
    "image" VARCHAR(255),
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stok" (
    "id" UUID NOT NULL,
    "produk_id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "qty" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diskon" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(30) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "value" DECIMAL NOT NULL,
    "start_diskon" DATE NOT NULL,
    "end_diskon" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diskon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mark" VARCHAR(10) NOT NULL,
    "sub_total" MONEY,
    "total_diskon" MONEY,
    "total" MONEY,
    "pembayaran" MONEY,
    "kembalian" MONEY,
    "no_faktur" CHAR(11),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaksi_Detail" (
    "id" UUID NOT NULL,
    "transaksi_id" UUID NOT NULL,
    "produk_id" UUID NOT NULL,
    "barcode" VARCHAR(50) NOT NULL,
    "produk_nama" VARCHAR(100) NOT NULL,
    "produk_harga_beli" MONEY NOT NULL,
    "produk_harga_jual" MONEY NOT NULL,
    "qty" INTEGER NOT NULL,
    "diskon_id" UUID NOT NULL,
    "diskon_nama" VARCHAR(30) NOT NULL,
    "diskon_total" MONEY NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaksi_Detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_toko_id_fkey" FOREIGN KEY ("toko_id") REFERENCES "Toko"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "Kategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_diskon_id_fkey" FOREIGN KEY ("diskon_id") REFERENCES "Diskon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stok" ADD CONSTRAINT "Stok_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "Produk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stok" ADD CONSTRAINT "Stok_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transaksi_Detail" ADD CONSTRAINT "Transaksi_Detail_transaksi_id_fkey" FOREIGN KEY ("transaksi_id") REFERENCES "Transaksi"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transaksi_Detail" ADD CONSTRAINT "Transaksi_Detail_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transaksi_Detail" ADD CONSTRAINT "Transaksi_Detail_diskon_id_fkey" FOREIGN KEY ("diskon_id") REFERENCES "Diskon"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
