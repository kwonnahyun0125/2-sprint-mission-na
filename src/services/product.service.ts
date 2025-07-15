import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
  static async createProduct(data: {
    name: string;
    description: string;
    price: number;
    tags: string[];
    imageUrl?: string;
    ownerId: number;
  }) {
    return prisma.product.create({ data });
  }

  static async getProductById(productId: number, userId?: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { likes: true },
    });

    if (!product) return null;

    const isLiked = userId
      ? product.likes.some((like) => like.userId === userId)
      : false;

    const likeCount = product.likes.length;

    const { likes, ...rest } = product;
    return { ...rest, isLiked, likeCount };
  }

  static async updateProduct(productId: number, data: any) {
    return prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  static async deleteProduct(productId: number) {
    return prisma.product.delete({ where: { id: productId } });
  }

  static async getProductList(offset: number, limit: number, search: string) {
    return prisma.product.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        imageUrl: true,
      },
    });
  }

  static async likeProduct(userId: number, productId: number) {
    return prisma.productLike.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      create: {
        userId,
        productId,
      },
      update: {},
    });
  }

  static async unlikeProduct(userId: number, productId: number) {
    return prisma.productLike.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  static async getProductLikes(productId: number) {
    const likes = await prisma.productLike.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return likes.map((like) => like.user);
  }
}