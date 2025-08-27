import express from 'express';
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductList,
  getProductLikes,
  likeProduct,
  unlikeProduct,
} from '../controllers/product.controller';
import { validateProduct } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { requireOwnership } from '../middlewares/ownership';

const router: express.Router = express.Router();

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

// 상품 좋아요 목록 조회
router.get('/:id/likes', authenticate, getProductLikes);

export default router;