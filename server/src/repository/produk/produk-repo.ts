import { Diskon, Kategori, Prisma, PrismaClient, Produk } from "@prisma/client";

export class ProdukRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private include: Prisma.ProdukSelect = {
    id: true,
    kategori_id: true,
    diskon_id: true,
    barcode: true,
    nama: true,
    harga_beli: true,
    harga_jual: true,
    total_stok: true,
    image: true,
    status: true,
    created_at: true,
    updated_at: true,
  };

  exclude(keys: (keyof Produk)[]): Prisma.ProdukSelect {
    const ex: Prisma.ProdukSelect = this.include;

    for (const k of keys) {
      ex[k] = false;
    }

    return ex;
  }

  async create(data: Prisma.ProdukUncheckedCreateInput): Promise<void> {
    await this.prisma.produk.create({
      data,
    });
  }

  async update(id: string, toko_id: string, data: Prisma.ProdukUpdateInput): Promise<void> {
    await this.prisma.produk.update({
      data,
      where: {
        id,
        toko_id,
      },
    });
  }

  async remove(id: string, toko_id: string): Promise<void> {
    await this.prisma.produk.delete({ where: { id, toko_id } });
  }

  async detail(
    idOrBarcode: string,
    toko_id: string
  ): Promise<
    | (Produk & {
        kategori: Pick<Kategori, "id" | "nama">;
      })
    | null
  > {
    const res = await this.prisma.produk.findFirst({
      where: {
        ...(idOrBarcode.length >= 32 ? { id: idOrBarcode } : { barcode: idOrBarcode }),
        toko_id,
      },
      include: {
        diskon: {
          select: {
            id: true,
            nama: true,
            type: true,
            value: true,
            start_diskon: true,
            end_diskon: true,
            status: true,
          },
        },
        kategori: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    return res;
  }

  async detailWithoutId(
    where: Prisma.ProdukWhereInput
  ): Promise<(Produk & { kategori: Pick<Kategori, "id" | "nama"> }) | null> {
    const res = await this.prisma.produk.findFirst({
      where,
      select: {
        ...this.include,
        kategori: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    return res;
  }

  async list(
    page: number,
    pageSize: number,
    where: Prisma.ProdukWhereInput
  ): Promise<(Produk & { kategori: Pick<Kategori, "id" | "nama"> })[]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const res = await this.prisma.produk.findMany({
      select: {
        ...this.include,
        diskon: {
          select: {
            id: true,
            nama: true,
            type: true,
            value: true,
            start_diskon: true,
            end_diskon: true,
            status: true,
          },
        },
        kategori: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      where,
      skip,
      take,
    });

    return res;
  }
  async listCount(toko_id: string): Promise<number> {
    const count = await this.prisma.produk.count({ where: { toko_id } });
    return count;
  }
}
