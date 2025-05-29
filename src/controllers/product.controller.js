import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

export const createProduct = async (req, res, next) => {
  try {
    console.log('요청 body:', req.body);
    const { name, description, price, tags, imageUrl } = req.body; 
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        tags,
        imageUrl, 
      },
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('오류 발생:', err);
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const updated = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, price: parseInt(price), tags },
    });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

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
