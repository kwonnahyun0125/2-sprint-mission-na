import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

// 상품 생성
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags, imageUrl } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        tags,
        imageUrl,
        ownerId: req.user.id,
      },
    });
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

// 상품 단건 조회 (isLiked, likeCount 포함)
export const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

      const product = await prisma.product.findUnique({
      where: { id },
      include: req.user
        ? {
            likes: {
              where: { userId: req.user.id },
              select: { id: true },
            },
          }
        : {},
    });

    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

    // 좋아요 개수
    const likeCount = await prisma.productLike.count({ where: { productId: id } });
    // 좋아요 눌렀는지
    const isLiked = req.user ? (product.likes && product.likes.length > 0) : false;

    // productLikes 필드 제거
    const { productLikes, ...rest } = product;

    return res.status(200).json({ ...rest, isLiked, likeCount });
  } catch (err) {
    next(err);
  }
};

// 상품 수정
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags, imageUrl } = req.body;
    const updated = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, price: parseInt(price), tags, imageUrl },
    });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// 상품 삭제
export const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 상품 목록 조회
export const getProductList = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, search = '' } = req.query;
    const products = await prisma.product.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
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
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// 상품 좋아요
export const likeProduct = async (req, res, next) => {
  try {
    await prisma.productLike.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: parseInt(req.params.id),
        },
      },
      create: {
        userId: req.user.id,
        productId: parseInt(req.params.id),
      },
      update: {},
    });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// 상품 좋아요 취소
export const unlikeProduct = async (req, res, next) => {
  try {
    await prisma.productLike.delete({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: parseInt(req.params.id),
        },
      },
    });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
