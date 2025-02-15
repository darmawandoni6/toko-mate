"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KategoriRepository = void 0;
class KategoriRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        await this.prisma.kategori.create({
            data,
        });
    }
    async update(id, data) {
        await this.prisma.kategori.update({
            data,
            where: { id },
        });
    }
    async list() {
        const res = await this.prisma.kategori.findMany();
        return res;
    }
    async remove(id) {
        await this.prisma.kategori.delete({ where: { id } });
    }
}
exports.KategoriRepository = KategoriRepository;
