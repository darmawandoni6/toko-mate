import { Prisma, PrismaClient, Transaksi_Detail } from "@prisma/client";

export class TransaksiDetailRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async list(transaksi_id: string, toko_id: string): Promise<Transaksi_Detail[]> {
    const res = await this.prisma.transaksi_Detail.findMany({
      where: { transaksi_id, toko_id },
      include: {
        produk: {
          select: {
            image: true,
          },
        },
      },
    });
    return res;
  }

  async find(
    transaksi_id: string,
    produk_id: string,
    toko_id: string
  ): Promise<Pick<Transaksi_Detail, "id" | "qty"> | null> {
    const res = await this.prisma.transaksi_Detail.findFirst({
      where: { transaksi_id, produk_id, toko_id },
      select: {
        id: true,
        qty: true,
      },
    });
    return res;
  }

  async add(data: Prisma.Transaksi_DetailUncheckedCreateInput): Promise<Transaksi_Detail> {
    const res = await this.prisma.transaksi_Detail.create({ data });
    return res;
  }

  async update(
    { id, transaksi_id, toko_id }: Pick<Transaksi_Detail, "id" | "transaksi_id" | "toko_id">,
    data: Prisma.Transaksi_DetailUncheckedUpdateInput
  ): Promise<void> {
    if (data.qty === 0) {
      await this.remove({ id, transaksi_id, toko_id });
      return;
    }
    await this.prisma.transaksi_Detail.update({ where: { id, transaksi_id, toko_id }, data });
  }

  async remove({
    id,
    transaksi_id,
    toko_id,
  }: Pick<Transaksi_Detail, "id" | "transaksi_id" | "toko_id">): Promise<void> {
    await this.prisma.transaksi_Detail.delete({ where: { id, transaksi_id, toko_id } });
  }
}
