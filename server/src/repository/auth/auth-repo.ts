import { Prisma, PrismaClient, Toko, User } from "@prisma/client";

export class AuthRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async register(data: Prisma.TokoCreateInput): Promise<void> {
    await this.prisma.toko.create({
      data,
    });
  }

  async find(email: string): Promise<Pick<User, "email" | "password" | "toko_id"> | null> {
    const data = await this.prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        password: true,
        toko_id: true,
      },
    });
    return data;
  }

  async profile(where: Pick<User, "email" | "toko_id">): Promise<(User & { toko: Toko }) | null> {
    const data = await this.prisma.user.findUnique({
      where: { email: where.email, toko_id: where.toko_id },
      select: {
        email: true,
        toko_id: true,
        password: true,
        created_at: true,
        updated_at: true,
        toko: true,
        nama: true,
      },
    });

    return data;
  }
  async update(where: Pick<User, "email" | "toko_id">, data: Prisma.UserUpdateInput): Promise<void> {
    await this.prisma.user.update({
      where: { email: where.email, toko_id: where.toko_id },
      data: data,
    });
  }
}
