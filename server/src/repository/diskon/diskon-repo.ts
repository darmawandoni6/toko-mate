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
  async update(id: string, data: Prisma.DiskonUpdateInput): Promise<void> {
    await this.prisma.diskon.update({ where: { id }, data });
  }
  async remove(id: string): Promise<void> {
    await this.prisma.diskon.delete({ where: { id } });
  }
  async detail(id: string): Promise<Diskon | null> {
    const res = await this.prisma.diskon.findUnique({ where: { id } });
    return res;
  }
  async listAll(status: boolean): Promise<Diskon[]> {
    const res = await this.prisma.diskon.findMany({
      where: { status },
    });
    return res;
  }
  async list(query: QueryPage): Promise<Diskon[]> {
    const skip = (query.page - 1) * query.pageSize;
    const take = query.pageSize;
    const res = await this.prisma.diskon.findMany({
      skip,
      take,
    });
    return res;
  }
  async count(): Promise<number> {
    const res = await this.prisma.diskon.count();
    return res;
  }
}
