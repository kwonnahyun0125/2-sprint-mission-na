import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

// 상품 생성
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = CreateProductDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const product = await ProductService.createProduct({
      ...parsed.data,
      ownerId: req.user!.id,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// 상품 단건 조회
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductService.getProductById(id, req.user?.id);

    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// 상품 목록 조회
export const getProductList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset = '0', limit = '10', search = '' } = req.query as {
      offset?: string;
      limit?: string;
      search?: string;
    };

    const products = await ProductService.getProductList(
      parseInt(offset),
      parseInt(limit),
      search
    );

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// 상품 수정
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = UpdateProductDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const updated = await ProductService.updateProduct(parseInt(req.params.id), parsed.data);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// 상품 삭제
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ProductService.deleteProduct(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 상품 좋아요
export const likeProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ProductService.likeProduct(req.user!.id, parseInt(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// 상품 좋아요 취소
export const unlikeProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ProductService.unlikeProduct(req.user!.id, parseInt(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// 상품 좋아요 유저 목록
export const getProductLikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await ProductService.getProductLikes(parseInt(req.params.productId));
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
