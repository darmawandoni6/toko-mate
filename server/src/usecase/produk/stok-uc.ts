import createHttpError from "http-errors";
import Joi from "joi";
import { Pagination } from "src/global";

import { Prisma, Produk, Stok } from "@prisma/client";
import { StokRepository } from "@repository/produk/stok-repo";
import { resJson } from "@util/resJson";

import { QueryPage } from "./types";

export class StokUsecase {
  private readonly repo: StokRepository;
  private data_create!: Prisma.StokUncheckedCreateInput;
  private data_update_produk!: Pick<Produk, "harga_beli" | "harga_jual">;

  constructor(repo: StokRepository) {
    this.repo = repo;
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
    create: Joi.object<Stok & { produk: Produk }>({
      produk_id: Joi.string().required(),
      qty: Joi.number().required(),
      deskripsi: Joi.string().required(),
      produk: Joi.object<Produk>({
        harga_beli: Joi.number().required(),
        harga_jual: Joi.number().required(),
      }).required(),
    }),
    listQuery: Joi.object<QueryPage>({
      page: Joi.number().required(),
      pageSize: Joi.number().required(),
    }),
  };

  set setCreate(payload: Stok & { produk: Produk }) {
    const { produk, ...data } = this.validate(this.validationSchemas.create, payload);
    this.data_create = {
      produk_id: data.produk_id,
      qty: data.qty,
      deskripsi: data.deskripsi,
      email: data.email,
    };
    this.data_update_produk = produk;
  }

  async create(email: string): Promise<ReturnType<typeof this.result>> {
    this.data_create.email = email;
    await this.repo.create(this.data_create, this.data_update_produk);
    return this.result();
  }
  async list(query: QueryPage): Promise<ReturnType<typeof this.result>> {
    const payload = this.validate(this.validationSchemas.listQuery, query);

    const result = await this.repo.list(query.page, query.pageSize);
    const count = await this.repo.listCount();
    const pagination: Pagination = {
      page: payload.page,
      limit: payload.pageSize,
      lastPage: Math.ceil(count / payload.pageSize),
      total: count,
    };
    return this.result(result, pagination);
  }
}
