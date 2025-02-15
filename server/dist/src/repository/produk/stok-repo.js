"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StokRepository = void 0;
class StokRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, price) {
        await this.prisma.$transaction(async (tx) => {
            await tx.stok.create({ data });
            await tx.produk.update({
                where: { id: data.produk_id },
                data: {
                    harga_jual: price.harga_jual,
                    harga_beli: price.harga_beli,
                    total_stok: data.qty > 0
                        ? {
                            increment: data.qty,
                        }
                        : { decrement: Math.abs(data.qty) },
                },
            });
        });
    }
    async list(page, pageSize) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const res = await this.prisma.stok.findMany({
            skip,
            take,
            select: {
                id: true,
                produk_id: true,
                email: true,
                qty: true,
                deskripsi: true,
                created_at: true,
                updated_at: true,
                produk: {
                    select: {
                        id: true,
                        barcode: true,
                        nama: true,
                        harga_beli: true,
                        harga_jual: true,
                    },
                },
            },
        });
        return res;
    }
    async listCount() {
        const count = await this.prisma.stok.count();
        return count;
    }
}
exports.StokRepository = StokRepository;
