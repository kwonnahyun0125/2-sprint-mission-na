import express from 'express';
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductList,
  likeProduct,
  unlikeProduct,
} from '../controllers/product.controller.js';
import { validateProduct } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { requireOwnership } from '../middlewares/ownership.js';

const router = express.Router();

// 상품 목록 조회, 생성
router.route('/')
  .get(getProductList)
  .post(authenticate, validateProduct, createProduct);

// 상품 상세 조회, 수정, 삭제
router.route('/:id')
  .get(authenticate, getProductById)
  .patch(authenticate, requireOwnership('product'), updateProduct)
  .delete(authenticate, requireOwnership('product'), deleteProduct);

// 상품 좋아요/취소
router.post('/:id/like', authenticate, likeProduct);
router.delete('/:id/like', authenticate, unlikeProduct);

export default router;
