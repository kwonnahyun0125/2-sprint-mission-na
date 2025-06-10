import express from 'express';
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductList,
} from '../controllers/product.controller.js';
import { validateProduct } from '../middlewares/validation.js';

const router = express.Router();

// 상품 목록 조회, 생성 (중복 라우트 방지)
router.route('/')
  .get(getProductList)
  .post(validateProduct, createProduct);

// 상품 상세 조회, 수정, 삭제 (중복 라우트 방지)
  router.route('/:id')
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);
export default router;

