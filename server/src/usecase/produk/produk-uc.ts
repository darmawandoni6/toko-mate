import createHttpError from "http-errors";
import Joi from "joi";
import { Pagination } from "src/global";

import { Prisma, Produk } from "@prisma/client";
import { ProdukRepository } from "@repository/produk/produk-repo";
import { resJson } from "@util/resJson";

import { ListQuery } from "./types";

export class ProdukUsecase {
  private readonly repo: ProdukRepository;
  toko_id!: string;
  private data_create!: Prisma.ProdukUncheckedCreateInput;
  private data_update!: Prisma.ProdukUncheckedUpdateInput;
  private data_detail!: { search: string };

  constructor(repo: ProdukRepository) {
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
    create: Joi.object<Produk>({
      barcode: Joi.string().required(),
      kategori_id: Joi.string().required(),
      nama: Joi.string().required(),
      harga_beli: Joi.number().required(),
      harga_jual: Joi.number().required(),
      total_stok: Joi.number().required(),
    }),
    update: Joi.object<Produk>({
      barcode: Joi.string(),
      kategori_id: Joi.string(),
      nama: Joi.string(),
      harga_beli: Joi.number(),
      harga_jual: Joi.number(),
      total_stok: Joi.number(),
      status: Joi.boolean(),
      diskon_id: Joi.string(),
    }),
    list: Joi.object<ListQuery>({
      page: Joi.number().required(),
      pageSize: Joi.number().required(),
      search: Joi.string(),
      kategori: Joi.string(),
    }),
    detail: Joi.object<{ search: string }>({
      search: Joi.string().required(),
    }),
  };

  set dataCreate(payload: Produk) {
    const data = this.validate(this.validationSchemas.create, payload);
    this.data_create = data;
    this.data_create.toko_id = this.toko_id;
  }
  set dataUpdate(payload: Produk) {
    const data = this.validate(this.validationSchemas.update, payload);
    this.data_update = data;
  }
  set dataDetail(payload: { search: string }) {
    const data = this.validate(this.validationSchemas.detail, payload);
    this.data_detail = data;
  }

  async create(): Promise<ReturnType<typeof this.result>> {
    await this.repo.create(this.data_create);
    return this.result();
  }
  async update(id: string): Promise<ReturnType<typeof this.result>> {
    await this.repo.update(id, this.toko_id, this.data_update);
    return this.result();
  }
  async remove(id: string): Promise<ReturnType<typeof this.result>> {
    await this.repo.remove(id, this.toko_id);
    return this.result();
  }
  async detail(id: string): Promise<ReturnType<typeof this.result>> {
    const result = await this.repo.detail(id, this.toko_id);
    return this.result(result);
  }
  async detailWithoutId(): Promise<ReturnType<typeof this.result>> {
    const result = await this.repo.detailWithoutId({
      toko_id: this.toko_id,
      OR: [
        {
          barcode: this.data_detail.search,
        },
        {
          nama: {
            contains: this.data_detail.search,
            mode: "insensitive",
          },
        },
      ],
    });
    return this.result(result);
  }

  async list(query: ListQuery): Promise<ReturnType<typeof this.result>> {
    const payload = this.validate(this.validationSchemas.list, query);
    const where: Prisma.ProdukWhereInput = { toko_id: this.toko_id };
    if (payload.search) {
      where.OR = [
        {
          barcode: payload.search,
        },
        {
          nama: {
            contains: payload.search,
            mode: "insensitive",
          },
        },
      ];
    }
    if (query.kategori) {
      where.kategori_id = query.kategori;
    }

    const result = await this.repo.list(payload.page, payload.pageSize, where);
    const count = await this.repo.listCount(this.toko_id);
    const pagination: Pagination = {
      page: payload.page,
      limit: payload.pageSize,
      lastPage: Math.ceil(count / payload.pageSize),
      total: count,
    };
    return this.result(result, pagination);
  }

  validateImage(file?: Express.Multer.File) {
    if (!file) {
      return createHttpError.BadRequest("Invalid file type or no file uploaded!");
    }
    return file;
  }
  async updateImage(id: string, image: string) {
    await this.repo.update(id, this.toko_id, { image });
    return this.result();
  }
}
