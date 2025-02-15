import { Kategori, Prisma, PrismaClient } from "@prisma/client";

export class KategoriRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.KategoriCreateInput): Promise<void> {
    await this.prisma.kategori.create({
      data,
    });
  }
  async update(id: string, toko_id: string, data: Prisma.KategoriUpdateInput): Promise<void> {
    await this.prisma.kategori.update({
      data,
      where: { id, toko_id },
    });
  }
  async list(toko_id: string): Promise<Kategori[]> {
    const res = await this.prisma.kategori.findMany({ where: { toko_id } });
    return res;
  }
  async remove(id: string, toko_id: string): Promise<void> {
    await this.prisma.kategori.delete({ where: { id, toko_id } });
  }
}
