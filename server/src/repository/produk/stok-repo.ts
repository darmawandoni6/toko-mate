import { Prisma, PrismaClient, Produk, Stok } from "@prisma/client";

export class StokRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.StokUncheckedCreateInput, price: Pick<Produk, "harga_jual" | "harga_beli">): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.stok.create({ data });
      await tx.produk.update({
        where: { id: data.produk_id },
        data: {
          harga_jual: price.harga_jual,
          harga_beli: price.harga_beli,
          total_stok:
            data.qty > 0
              ? {
                  increment: data.qty,
                }
              : { decrement: Math.abs(data.qty) },
        },
      });
    });
  }

  async list(
    toko_id: string,
    page: number,
    pageSize: number
  ): Promise<
    (Omit<Stok, "toko_id"> & { produk: Pick<Produk, "id" | "barcode" | "nama" | "harga_beli" | "harga_jual"> })[]
  > {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const res = await this.prisma.stok.findMany({
      where: { toko_id },
      skip,
      take,
      select: {
        id: true,
        produk_id: true,
        email: true,
        qty: true,
        deskripsi: true,
        mark: true,
        created_at: true,
        updated_at: true,
        produk: {
          select: {
            id: true,
            barcode: true,
            nama: true,
            harga_beli: true,
            harga_jual: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
    return res;
  }
  async listCount(toko_id: string): Promise<number> {
    const count = await this.prisma.stok.count({ where: { toko_id } });
    return count;
  }
}
