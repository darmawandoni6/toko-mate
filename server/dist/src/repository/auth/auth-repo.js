"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(data) {
        await this.prisma.toko.create({
            data,
        });
    }
    async find(email) {
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
    async profile(where) {
        const data = await this.prisma.user.findUnique({
            where: { email: where.email, toko_id: where.toko_id },
            select: {
                email: true,
                toko_id: true,
                password: true,
                created_at: true,
                updated_at: true,
                toko: true,
            },
        });
        return data;
    }
}
exports.AuthRepository = AuthRepository;
