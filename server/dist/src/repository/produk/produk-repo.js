"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdukRepository = void 0;
class ProdukRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    include = {
        id: true,
        kategori_id: true,
        diskon_id: true,
        barcode: true,
        nama: true,
        harga_beli: true,
        harga_jual: true,
        total_stok: true,
        image: true,
        status: true,
        created_at: true,
        updated_at: true,
    };
    exclude(keys) {
        const ex = this.include;
        for (const k of keys) {
            ex[k] = false;
        }
        return ex;
    }
    async create(data) {
        await this.prisma.produk.create({
            data,
        });
    }
    async update(id, data) {
        await this.prisma.produk.update({ data, where: { id } });
    }
    async remove(id) {
        await this.prisma.produk.delete({ where: { id } });
    }
    async detail(id) {
        const select = {
            ...this.include,
        };
        select.kategori = true;
        const res = await this.prisma.produk.findUnique({
            where: { id },
            select: this.include,
        });
        return res;
    }
    async list(page, pageSize, where) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const select = {
            ...this.include,
        };
        select.kategori = true;
        const res = await this.prisma.produk.findMany({
            select: this.include,
            orderBy: {
                created_at: "desc",
            },
            where,
            skip,
            take,
        });
        return res;
    }
    async listCount() {
        const count = await this.prisma.produk.count();
        return count;
    }
}
exports.ProdukRepository = ProdukRepository;
