import { Diskon, Prisma, PrismaClient } from "@prisma/client";
import { QueryPage } from "@usecase/diskon/types";

export class DiskonRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.DiskonCreateInput): Promise<void> {
    await this.prisma.diskon.create({ data });
  }
  async update(id: string, toko_id: string, data: Prisma.DiskonUpdateInput): Promise<void> {
    await this.prisma.diskon.update({ where: { id, toko_id }, data });
  }
  async remove(id: string, toko_id: string): Promise<void> {
    await this.prisma.diskon.delete({ where: { id, toko_id } });
  }
  async detail(id: string, toko_id: string): Promise<Diskon | null> {
    const res = await this.prisma.diskon.findUnique({ where: { id, toko_id } });
    return res;
  }
  async listAll(status: boolean, toko_id: string): Promise<Diskon[]> {
    const res = await this.prisma.diskon.findMany({
      where: { status, toko_id },
    });
    return res;
  }
  async list(query: QueryPage, toko_id: string): Promise<Diskon[]> {
    const skip = (query.page - 1) * query.pageSize;
    const take = query.pageSize;
    const res = await this.prisma.diskon.findMany({
      skip,
      take,
      where: { toko_id },
    });
    return res;
  }
  async count(toko_id: string): Promise<number> {
    const res = await this.prisma.diskon.count({ where: { toko_id } });
    return res;
  }
}
