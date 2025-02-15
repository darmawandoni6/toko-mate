import { Prisma, PrismaClient, Transaksi, Transaksi_Detail } from "@prisma/client";
import { QueryPage } from "@usecase/produk/types";
import { RangeDate } from "@usecase/transaksi/types";

export class TransaksiRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.TransaksiUncheckedCreateInput): Promise<{ id: string }> {
    const res = await this.prisma.transaksi.create({ data, select: { id: true } });
    return res;
  }

  async update(
    id: string,
    data: Prisma.TransaksiUpdateInput,
    stocks: Pick<Transaksi_Detail, "qty" | "produk_id">[]
  ): Promise<void> {
    await this.prisma.$transaction(async (trx) => {
      await trx.transaksi.update({ where: { id }, data });
      for (const v of stocks) {
        await trx.stok.create({
          data: {
            qty: v.qty,
            deskripsi: `transaksi: ${data.no_faktur} by: ${data.updated_by}`,
            produk_id: v.produk_id,
            mark: "TRANSAKSI",
            email: String(data.updated_by),
          },
        });
        await trx.produk.update({
          where: { id: v.produk_id },
          data: {
            total_stok: { decrement: v.qty },
          },
        });
      }
    });
  }

  async list({ mark, email }: Pick<Transaksi, "mark" | "email">): Promise<Pick<Transaksi, "id">[]> {
    const res = await this.prisma.transaksi.findMany({ where: { mark, email } });
    return res;
  }

  async listReport({ page, pageSize }: QueryPage): Promise<Transaksi[]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const res = await this.prisma.transaksi.findMany({
      where: { mark: "SUCCESS" },
      skip,
      take,
      orderBy: { no_faktur: "desc" },
    });

    return res;
  }

  async listPayment(id: string): Promise<
    | (Pick<Transaksi, "id" | "sub_total" | "total_diskon" | "total"> & {
        transaksi: Pick<Transaksi_Detail, "id" | "transaksi_id" | "sub_total" | "diskon_total" | "qty" | "produk_id">[];
      })
    | null
  > {
    const res = await this.prisma.transaksi.findUnique({
      where: { id, mark: "PENDING" },
      select: {
        id: true,
        sub_total: true,
        total_diskon: true,
        total: true,
        transaksi: {
          select: {
            id: true,
            transaksi_id: true,
            sub_total: true,
            diskon_total: true,
            qty: true,
            produk_id: true,
          },
        },
      },
    });
    return res;
  }
  async countSuccess(option?: RangeDate): Promise<number> {
    const count = await this.prisma.transaksi.count({
      where: {
        mark: "SUCCESS",
        ...(option ? { updated_at: { gte: option.gte, lt: option.lt } } : {}),
      },
    });
    return count;
  }

  async detail({ id, email }: Pick<Transaksi, "id" | "email">): Promise<Transaksi | null> {
    const res = await this.prisma.transaksi.findFirst({ where: { id, email } });
    return res;
  }
  async remove({ id, email, mark }: Pick<Transaksi, "id" | "email" | "mark">): Promise<void> {
    await this.prisma.$transaction(async (trx) => {
      await trx.transaksi_Detail.deleteMany({ where: { transaksi_id: id } });
      await trx.transaksi.delete({ where: { id, email, mark } });
    });
  }
  async transaksiPerHari(email: string, gte: Date, lte: Date): Promise<number> {
    const res = await this.prisma.transaksi.aggregate({
      where: {
        email,
        mark: "SUCCESS",
        updated_at: {
          gte,
          lte,
        },
      },
      _sum: {
        total: true,
      },
    });

    return res._sum.total ? res._sum.total.toNumber() : 0;
  }

  async getTransaksi(
    gte: Date,
    lte: Date
  ): Promise<
    (Pick<Transaksi, "updated_at" | "total"> & {
      transaksi: Pick<Transaksi_Detail, "produk_id" | "produk_nama" | "qty" | "sub_total">[];
    })[]
  > {
    const res = await this.prisma.transaksi.findMany({
      where: {
        mark: "SUCCESS",
        updated_at: {
          gte,
          lte,
        },
      },
      orderBy: {
        updated_at: "desc",
      },
      select: {
        updated_at: true,
        total: true,
        transaksi: {
          select: {
            produk_id: true,
            produk_nama: true,
            qty: true,
            sub_total: true,
          },
        },
      },
    });
    return res;
  }
}
