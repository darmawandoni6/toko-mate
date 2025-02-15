import { Response } from "express";

import createHttpError from "http-errors";
import Joi from "joi";

import { Prisma, Toko, User } from "@prisma/client";
import { AuthRepository } from "@repository/auth/auth-repo";
import { compare, encrypt } from "@util/bcrypt";
import { resJson } from "@util/resJson";
import { generateToken } from "@util/token";

export class AuthUsecase {
  private readonly repo: AuthRepository;
  private body_register!: Toko & { user: User };
  private body_login!: Pick<User, "email" | "password">;
  private body_update!: Prisma.UserUpdateInput;

  constructor(repo: AuthRepository) {
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
    register: Joi.object<Toko & { user: User }>({
      nama: Joi.string().required(),
      alamat: Joi.string().required(),
      hp: Joi.string().required(),
      user: Joi.object<User>({
        nama: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }).required(),
    }),
    login: Joi.object<User>({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
    update: Joi.object<Toko & { user: User }>({
      nama: Joi.string().required(),
      alamat: Joi.string().required(),
      hp: Joi.string().required(),
      user: Joi.object<User>({
        email: Joi.string().required(),
        nama: Joi.string().required(),
        password: Joi.string().allow(""),
      }).required(),
    }),
  };

  set bodyRegister(payload: Toko & { user: User }) {
    const body = this.validate(this.validationSchema.register, payload);
    this.body_register = body;
  }
  set bodyLogin(payload: User) {
    const body = this.validate(this.validationSchema.login, payload);
    this.body_login = body;
  }

  set bodyUpdate(payload: Toko & { user: User }) {
    const { user, ...toko } = this.validate(this.validationSchema.update, payload);
    this.body_update = {
      nama: user.nama,
      email: user.email,
      ...(user.password ? { password: encrypt(user.password) } : {}),
      toko: {
        update: {
          nama: toko.nama,
          alamat: toko.alamat,
          hp: toko.hp,
        },
      },
    };
  }

  async checkAccount(): Promise<void> {
    const res = await this.repo.find(this.body_register.user.email);

    if (res) {
      throw createHttpError.Conflict(`${this.body_register.user.email} sudah digunakan`);
    }
  }

  async register(): Promise<ReturnType<typeof this.result>> {
    const { user, ...body } = this.body_register;
    const data: Prisma.TokoCreateInput = {
      nama: body.nama,
      alamat: body.alamat,
      hp: body.hp,
      user: {
        create: {
          nama: user.nama,
          email: user.email,
          password: encrypt(user.password),
        },
      },
    };
    await this.repo.register(data);
    return this.result();
  }

  async login(res: Response): Promise<ReturnType<typeof this.result>> {
    const user = await this.repo.find(this.body_login.email);
    if (!user) {
      throw createHttpError.NotFound("email/password tidak ada");
    }

    const match = compare(this.body_login.password, user.password);
    if (!match) {
      throw createHttpError.NotFound("email/password tidak ada");
    }
    const token = generateToken({
      email: user.email,
      toko_id: user.toko_id,
    });

    const expired = new Date(); // Now
    expired.setDate(expired.getDate() + parseInt(process.env.EXP_TOKEN as string, 10));

    res.cookie("token", token, { httpOnly: true, expires: expired });
    return this.result({ token, expired });
  }

  async profile(email: string, toko_id: string): Promise<ReturnType<typeof this.result>> {
    const res = await this.repo.profile({ email, toko_id });
    if (!res) {
      throw createHttpError.NotFound(`${email} tidak ditemukan`);
    }

    res.password = "";

    return this.result(res);
  }
  async UpdateProfile(email: string, toko_id: string): Promise<ReturnType<typeof this.result>> {
    await this.repo.update({ email, toko_id }, this.body_update);
    return this.result();
  }
}
