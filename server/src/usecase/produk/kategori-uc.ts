import createHttpError from "http-errors";
import Joi from "joi";

import { Kategori, Prisma } from "@prisma/client";
import { KategoriRepository } from "@repository/produk/kategori-repo";
import { resJson } from "@util/resJson";

export class KategoriUsecase {
  private readonly repo: KategoriRepository;
  toko_id!: string;
  private data_create!: Prisma.KategoriCreateInput;
  private data_update!: Prisma.KategoriUpdateInput;

  constructor(repo: KategoriRepository) {
    this.repo = repo;
  }

  private result<T>(data?: T) {
    return resJson(200, data);
  }

  private validate<T>(schema: Joi.Schema, payload: T): T {
    const { error, value } = schema.validate(payload);

    if (error) {
      throw new createHttpError.BadRequest(error.message);
    }

    return value;
  }

  private validationSchemas = {
    create: Joi.object<Kategori>({
      nama: Joi.string().required(),
    }),
    update: Joi.object<Kategori>({
      nama: Joi.string(),
      status: Joi.boolean(),
    }),
  };

  set dataCreate(payload: Kategori) {
    const data = this.validate(this.validationSchemas.create, payload);

    this.data_create = {
      nama: data.nama,
      status: true,
      toko_id: this.toko_id,
    };
  }

  set dataUpdate(payload: Kategori) {
    const data = this.validate(this.validationSchemas.update, payload);

    this.data_update = {
      nama: data.nama,
      status: data.status,
    };
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
  async list(): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo.list(this.toko_id);
    return this.result(res);
  }
}
