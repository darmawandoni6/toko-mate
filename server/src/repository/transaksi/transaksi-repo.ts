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
    toko_id: string,
    data: Prisma.TransaksiUpdateInput,
    stocks: Pick<Transaksi_Detail, "qty" | "produk_id">[]
  ): Promise<void> {
    await this.prisma.$transaction(async (trx) => {
      await trx.transaksi.update({ where: { id, toko_id }, data });
      for (const v of stocks) {
        await trx.stok.create({
          data: {
            qty: v.qty * -1,
            deskripsi: `transaksi: ${data.no_faktur} by: ${data.updated_by}`,
            produk_id: v.produk_id,
            mark: "TRANSAKSI",
            email: String(data.updated_by),
            toko_id,
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

  async list({
    mark,
    email,
    toko_id,
  }: Pick<Transaksi, "mark" | "email" | "toko_id">): Promise<Pick<Transaksi, "id">[]> {
    const res = await this.prisma.transaksi.findMany({ where: { mark, email, toko_id } });
    return res;
  }

  async listReport(toko_id: string, { page, pageSize }: QueryPage): Promise<Transaksi[]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const res = await this.prisma.transaksi.findMany({
      where: { mark: "SUCCESS", toko_id },
      skip,
      take,
      orderBy: { no_faktur: "desc" },
    });

    return res;
  }

  async listPayment(
    id: string,
    toko_id: string
  ): Promise<
    | (Pick<Transaksi, "id" | "sub_total" | "total_diskon" | "total"> & {
        transaksi: Pick<Transaksi_Detail, "id" | "transaksi_id" | "sub_total" | "diskon_total" | "qty" | "produk_id">[];
      })
    | null
  > {
    const res = await this.prisma.transaksi.findUnique({
      where: { id, mark: "PENDING", toko_id },
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
  async countSuccess(toko_id: string, option?: RangeDate): Promise<number> {
    const count = await this.prisma.transaksi.count({
      where: {
        mark: "SUCCESS",
        toko_id,
        ...(option ? { updated_at: { gte: option.gte, lt: option.lt } } : {}),
      },
    });
    return count;
  }

  async detail({ id, email, toko_id }: Pick<Transaksi, "id" | "email" | "toko_id">): Promise<Transaksi | null> {
    const res = await this.prisma.transaksi.findFirst({ where: { id, email, toko_id } });
    return res;
  }
  async remove({ id, email, mark, toko_id }: Pick<Transaksi, "id" | "email" | "mark" | "toko_id">): Promise<void> {
    await this.prisma.$transaction(async (trx) => {
      await trx.transaksi_Detail.deleteMany({ where: { transaksi_id: id, toko_id } });
      await trx.transaksi.delete({ where: { id, email, mark, toko_id } });
    });
  }
  async transaksiPerHari(email: string, toko_id: string, gte: Date, lte: Date): Promise<number> {
    const res = await this.prisma.transaksi.aggregate({
      where: {
        email,
        mark: "SUCCESS",
        toko_id,
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
    toko_id: string,
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
        toko_id,
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
