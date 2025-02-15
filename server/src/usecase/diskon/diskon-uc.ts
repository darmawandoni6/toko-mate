import createHttpError from "http-errors";
import Joi from "joi";

import { Diskon, Prisma } from "@prisma/client";
import { DiskonRepository } from "@repository/diskon/diskon-repo";
import { resJson } from "@util/resJson";

import { QueryPage } from "./types";

export class DiskonUsecase {
  private readonly repo: DiskonRepository;
  private data_create!: Prisma.DiskonCreateInput;
  private data_update!: Prisma.DiskonCreateInput;

  constructor(repo: DiskonRepository) {
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

  private validationSchema = {
    form: Joi.object<Diskon>({
      nama: Joi.string().required(),
      type: Joi.string().allow("percent", "rupiah").required(),
      value: Joi.number().required(),
      start_diskon: Joi.string().required(),
      end_diskon: Joi.string().allow(null),
      status: Joi.boolean(),
    }),
  };

  set dataCreate(payload: Diskon) {
    const data = this.validate(this.validationSchema.form, payload);
    this.data_create = {
      nama: data.nama,
      type: data.type,
      value: data.value,
      start_diskon: new Date(data.start_diskon),
      end_diskon: data.end_diskon ? new Date(data.end_diskon) : null,
    };
  }
  set dataUpdate(payload: Diskon) {
    const data = this.validate(this.validationSchema.form, payload);
    this.data_update = {
      nama: data.nama,
      type: data.type,
      value: data.value,
      start_diskon: new Date(data.start_diskon),
      end_diskon: data.end_diskon ? new Date(data.end_diskon) : null,
      status: typeof data.status === "boolean" ? data.status : true,
    };
  }

  async create(): Promise<ReturnType<typeof this.result>> {
    await this.repo.create(this.data_create);
    return this.result();
  }
  async update(id: string): Promise<ReturnType<typeof this.result>> {
    await this.repo.update(id, this.data_update);
    return this.result();
  }
  async detail(id: string): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo.detail(id);
    if (!res) {
      throw createHttpError.NotFound();
    }
    return this.result(res);
  }
  async remove(id: string): Promise<ReturnType<typeof this.result>> {
    await this.repo.remove(id);
    return this.result();
  }
  async list(query: QueryPage): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo.list(query);
    return this.result(res);
  }
  async listOption(): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo.listAll(true);
    return this.result(res);
  }
}
