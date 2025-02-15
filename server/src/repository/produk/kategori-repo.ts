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
  async update(id: string, data: Prisma.KategoriUpdateInput): Promise<void> {
    await this.prisma.kategori.update({
      data,
      where: { id },
    });
  }
  async list(): Promise<Kategori[]> {
    const res = await this.prisma.kategori.findMany();
    return res;
  }
  async remove(id: string): Promise<void> {
    await this.prisma.kategori.delete({ where: { id } });
  }
}
