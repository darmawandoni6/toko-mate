import { Transaksi, Transaksi_Detail } from "@prisma/client";

export type QueryPage = {
  page: number;
  pageSize: number;
};

export type RangeDate = { gte: Date; lt: Date };

export interface Transaksi_Pending extends Pick<Transaksi, "id" | "sub_total" | "total_diskon" | "total"> {
  transaksi: Pick<Transaksi_Detail, "id" | "transaksi_id" | "sub_total" | "diskon_total" | "qty" | "produk_id">[];
}
