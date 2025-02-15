import createHttpError from "http-errors";
import Joi, { number } from "joi";
import { Pagination } from "src/global";

import { Prisma, Transaksi, Transaksi_Detail } from "@prisma/client";
import { TransaksiDetailRepository } from "@repository/transaksi/transaksi-detail-repo";
import { TransaksiRepository } from "@repository/transaksi/transaksi-repo";
import { resJson } from "@util/resJson";

import { QueryPage } from "./types";

export class TransaksiUsecase {
  private readonly repo_transaksi: TransaksiRepository;
  private readonly repo_detail: TransaksiDetailRepository;
  toko_id!: string;
  private data_create!: Prisma.TransaksiUncheckedCreateInput;
  private data_item!: Prisma.Transaksi_DetailUncheckedCreateInput;
  private body_item!: Transaksi_Detail;
  private data_update_item!: Prisma.Transaksi_DetailUncheckedUpdateInput;
  private data_payment!: Prisma.TransaksiUncheckedUpdateInput;

  constructor(transaksi: TransaksiRepository, detail: TransaksiDetailRepository) {
    this.repo_transaksi = transaksi;
    this.repo_detail = detail;
  }

  private result<T, P>(data?: T, pagination?: P) {
    return resJson(200, data, pagination);
  }

  private validate<T>(schema: Joi.Schema, payload: T): T {
    const { error, value } = schema.validate(payload);

    if (error) {
      throw new createHttpError.BadRequest(error.message);
    }

    return value;
  }

  private validationSchemas = {
    create: Joi.object<Transaksi_Detail>({
      produk_id: Joi.string().required(),
      barcode: Joi.string().required(),
      produk_nama: Joi.string().required(),
      produk_harga_beli: Joi.string().required(),
      produk_harga_jual: Joi.string().required(),
      qty: Joi.number().required(),
      diskon_id: Joi.string(),
      diskon_nama: Joi.string().when("diskon_id", {
        is: Joi.exist(), // Jika diskon_id ada
        then: Joi.required(), // Maka diskon_total wajib diisi
      }),
      diskon_total: Joi.number().when("diskon_id", {
        is: Joi.exist(),
        then: Joi.required(),
      }),
    }),
    addItem: Joi.object<Transaksi_Detail>({
      transaksi_id: Joi.string().required(),
      produk_id: Joi.string().required(),
      barcode: Joi.string().required(),
      produk_nama: Joi.string().required(),
      produk_harga_beli: Joi.string().required(),
      produk_harga_jual: Joi.string().required(),
      qty: Joi.number().required(),
      diskon_id: Joi.string(),
      diskon_nama: Joi.string().when("diskon_id", {
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }),
      diskon_total: Joi.number().when("diskon_id", {
        then: Joi.number().required(),
        otherwise: Joi.number(),
      }),
    }),
    updateItem: Joi.object<Transaksi_Detail>({
      qty: Joi.number().required(),
      produk_harga_jual: Joi.number().required(),
      diskon_id: Joi.string(),
      diskon_nama: Joi.string().when("diskon_id", {
        is: Joi.exist(), // Jika diskon_id ada
        then: Joi.required(), // Maka diskon_total wajib diisi
      }),
      diskon_total: Joi.alternatives()
        .try(
          Joi.number(),
          Joi.custom((val, helpers) => {
            try {
              return val;
            } catch (error) {
              return helpers.error((error as Error).message);
            }
          })
        )
        .when("diskon_id", {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    }),
    payment: Joi.object<Transaksi>({
      pembayaran: Joi.number().required(),
      kembalian: Joi.number().required(),
    }),
  };

  private calculateDetail(detail: Transaksi_Detail) {
    detail.diskon_total = detail.diskon_total || new Prisma.Decimal(0);
    detail.sub_total = new Prisma.Decimal(detail.qty)
      .mul(new Prisma.Decimal(detail.produk_harga_jual))
      .sub(new Prisma.Decimal(detail.diskon_total ?? 0));

    return detail;
  }

  private formatNumber(num: number): string {
    return num.toString().padStart(4, "0");
  }

  set dataCreate(payload: Transaksi_Detail) {
    const data = this.validate(this.validationSchemas.create, payload);
    const detail = this.calculateDetail(data);

    this.data_create = {
      email: "",
      updated_by: "",
      mark: "PENDING",
      sub_total: 0,
      total_diskon: 0,
      total: 0,
      pembayaran: null,
      kembalian: null,
      no_faktur: null,
      toko_id: this.toko_id,
      transaksi: {
        create: {
          produk_id: detail.produk_id,
          barcode: detail.barcode,
          produk_nama: detail.produk_nama,
          produk_harga_beli: detail.produk_harga_beli,
          produk_harga_jual: detail.produk_harga_jual,
          qty: detail.qty,
          diskon_id: detail.diskon_id,
          diskon_nama: detail.diskon_nama,
          diskon_total: detail.diskon_total,
          sub_total: detail.sub_total,
          toko_id: this.toko_id,
        },
      },
    };
  }
  set dataItem(payload: Transaksi_Detail) {
    const data = this.validate(this.validationSchemas.addItem, payload);
    const detail = this.calculateDetail(data);

    this.body_item = data;
    this.data_item = {
      transaksi_id: detail.transaksi_id,
      produk_id: detail.produk_id,
      barcode: detail.barcode,
      produk_nama: detail.produk_nama,
      produk_harga_beli: detail.produk_harga_beli,
      produk_harga_jual: detail.produk_harga_jual,
      qty: detail.qty,
      diskon_id: detail.diskon_id,
      diskon_nama: detail.diskon_nama,
      diskon_total: detail.diskon_total,
      sub_total: detail.sub_total,
      toko_id: this.toko_id,
    };
  }
  set dataUpdateItem(payload: Transaksi_Detail) {
    const data: Pick<Transaksi_Detail, "qty" | "produk_harga_jual"> = this.validate(this.validationSchemas.updateItem, {
      qty: payload.qty,
      produk_harga_jual: payload.produk_harga_jual,
    });

    this.data_update_item = {
      qty: data.qty,
      diskon_total: payload.diskon_total,
      sub_total: data.qty > 0 ? data.qty * Number(data.produk_harga_jual) - Number(payload.diskon_total ?? 0) : 0,
    };
  }
  set dataPayment(payload: Transaksi) {
    const data = this.validate(this.validationSchemas.payment, payload);

    this.data_payment = {
      mark: "SUCCESS",
      pembayaran: data.pembayaran,
      kembalian: data.kembalian,
    };
  }

  async list(email: string): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo_transaksi.list({ email, mark: "PENDING", toko_id: this.toko_id });
    return this.result(res);
  }
  async listReport(query: QueryPage): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo_transaksi.listReport(this.toko_id, query);
    const count = await this.repo_transaksi.countSuccess(this.toko_id);
    const pagination: Pagination = {
      page: query.page,
      limit: query.pageSize,
      lastPage: Math.ceil(count / query.pageSize),
      total: count,
    };
    return this.result(res, pagination);
  }

  async create(email: string): Promise<ReturnType<typeof this.result>> {
    this.data_create.email = email;
    this.data_create.updated_by = email;
    const res = await this.repo_transaksi.create(this.data_create);
    return this.result(res);
  }
  async payment(id: string, email: string): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo_transaksi.listPayment(id, this.toko_id);

    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    const count = await this.repo_transaksi.countSuccess(this.toko_id, { gte: start, lt: end });

    if (!res) {
      throw createHttpError.NotFound(`id transaksi: ${id} tidak ditemukan`);
    }

    this.data_payment.updated_by = email;
    res.total_diskon ??= new Prisma.Decimal(0);

    for (const v of res.transaksi) {
      res.sub_total = res.sub_total.add(v.sub_total);

      const diskon_total = v.diskon_total ? v.diskon_total.mul(v.qty) : new Prisma.Decimal(0);
      res.total_diskon = res.total_diskon.add(diskon_total);
    }

    res.total = res.sub_total.sub(res.total_diskon);
    this.data_payment.sub_total = res.sub_total;
    this.data_payment.total_diskon = res.total_diskon;
    this.data_payment.total = res.total;

    const now = new Date();
    const year = now.getFullYear();
    const month = new Intl.DateTimeFormat("id-ID", { month: "2-digit" }).format(now);
    this.data_payment.no_faktur = `TM-${year}${month}-${this.formatNumber(count + 1)}`;

    const stok: Pick<Transaksi_Detail, "qty" | "produk_id">[] = res.transaksi.map((item) => ({
      qty: item.qty,
      produk_id: item.produk_id,
    }));

    await this.repo_transaksi.update(id, this.toko_id, this.data_payment, stok);
    return this.result();
  }

  async remove(id: string, email: string): Promise<ReturnType<typeof this.result>> {
    await this.repo_transaksi.remove({ id, email, mark: "PENDING", toko_id: this.toko_id });
    return this.result();
  }

  async listItem(transaksi_id: string): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo_detail.list(transaksi_id, this.toko_id);
    return this.result(res);
  }
  async addItem(): Promise<ReturnType<typeof this.result>> {
    await this.repo_detail.add(this.data_item);
    return this.result();
  }
  async checkItem(): Promise<ReturnType<typeof this.result> | void> {
    const { transaksi_id, produk_id } = this.body_item!;
    const check = await this.repo_detail.find(transaksi_id, produk_id, this.toko_id);
    if (!check) {
      return;
    }
    this.dataUpdateItem = this.body_item;
    await this.repo_detail.update({ id: check.id, transaksi_id, toko_id: this.toko_id }, this.data_update_item);

    return this.result();
  }
  async updateItem(id: string, transaksi_id: string): Promise<ReturnType<typeof this.result>> {
    await this.repo_detail.update({ id, transaksi_id, toko_id: this.toko_id }, this.data_update_item);
    return this.result();
  }
  async removeItem(id: string, transaksi_id: string): Promise<ReturnType<typeof this.result>> {
    await this.repo_detail.remove({ id, transaksi_id, toko_id: this.toko_id });
    return this.result();
  }

  async transaksiPerHari(email: string) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const res = await this.repo_transaksi.transaksiPerHari(email, this.toko_id, now, tomorrow);
    return this.result({ total: res });
  }

  private getWeekRange(date: Date, offsetWeeks: number = 0): { start: string; end: string } {
    const d = new Date(date);

    // Dapatkan hari Senin dari minggu ini
    const day = d.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    const diff = day === 0 ? -6 : 1 - day; // Geser ke Senin jika bukan Senin

    d.setDate(d.getDate() + diff + offsetWeeks * 7); // Geser mundur/maju berdasarkan offset minggu
    d.setHours(0, 0, 0, 0); // Reset waktu

    const start = new Date(d); // Tanggal Senin
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Tambah 6 hari untuk mendapatkan Minggu

    return {
      start: start.toISOString().split("T")[0], // Format YYYY-MM-DD
      end: end.toISOString().split("T")[0],
    };
  }

  private getWeeksInMonth(year: number, month: number): { start: string; end: string }[] {
    function getMonday(date: Date): Date {
      const d = new Date(date);
      const day = d.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
      const diff = day === 0 ? -6 : 1 - day; // Geser ke Senin jika bukan Senin
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0); // Reset waktu
      return d;
    }

    const firstDay = new Date(year, month - 1, 1); // Hari pertama bulan ini
    const lastDay = new Date(year, month, 0); // Hari terakhir bulan ini

    let currentMonday = getMonday(firstDay); // Cari Senin pertama
    const weeks = [];

    while (currentMonday <= lastDay) {
      const weekEnd = new Date(currentMonday);
      weekEnd.setDate(weekEnd.getDate() + 6); // Minggu = Senin + 6 hari

      // Pastikan tidak melewati akhir bulan
      if (weekEnd > lastDay) {
        weekEnd.setDate(lastDay.getDate());
      }

      weeks.push({
        start: currentMonday.toISOString().split("T")[0],
        end: weekEnd.toISOString().split("T")[0],
      });

      // Pindah ke Senin berikutnya
      currentMonday.setDate(currentMonday.getDate() + 7);
    }

    return weeks;
  }
  async transaksiReport(date: Date) {
    const thisWeek = this.getWeekRange(date, 0);
    const lastWeek = this.getWeekRange(date, -1);

    const weeks = this.getWeeksInMonth(date.getFullYear(), date.getMonth() + 1);

    const ls = new Date(lastWeek.start);
    const ws = new Date(weeks[0].start);
    const gte = ls > ws ? ws : ls;

    const we = new Date(weeks[weeks.length - 1].end);
    const lte = we;

    const result = await this.repo_transaksi.getTransaksi(this.toko_id, gte, lte);
    console.log({ result });

    const revenueOfWeek = {
      thisWeek: 0,
      lastWeek: 0,
    };
    const weekRevenue: number[] = weeks.map(() => 0);

    const topProduk: { [k: string]: Pick<Transaksi_Detail, "produk_nama" | "qty"> & { total: number } } = {};
    let topL = 0;

    for (const v of result) {
      for (const item of v.transaksi) {
        if (topProduk[item.produk_id]) {
          topProduk[item.produk_id].qty += item.qty;
          topProduk[item.produk_id].total += Number(item.sub_total);
        } else {
          if (topL > 10) continue;
          topL += 1;
          topProduk[item.produk_id] = {
            produk_nama: item.produk_nama,
            qty: item.qty,
            total: Number(item.sub_total),
          };
        }
      }

      const ut = v.updated_at;
      ut.setHours(0, 0, 0, 0);

      const idx = weeks.findIndex((item) => ut >= new Date(item.start) && new Date(item.end) >= ut);
      const prev = weekRevenue[idx] ?? 0;
      weekRevenue[idx] = prev + Number(v.total);
      console.log({ ut, thisWeek, r: ut >= new Date(thisWeek.start), e: new Date(thisWeek.end) >= ut });

      if (ut >= new Date(thisWeek.start) && new Date(thisWeek.end) >= ut) {
        console.log({ v });

        revenueOfWeek.thisWeek += Number(v.total);
        continue;
      }
      if (ut >= new Date(lastWeek.start) && new Date(lastWeek.end) >= ut) {
        revenueOfWeek.lastWeek += Number(v.total);
        continue;
      }
    }

    return this.result({ revenueOfWeek, weekRevenue, topProduk });
  }
}
