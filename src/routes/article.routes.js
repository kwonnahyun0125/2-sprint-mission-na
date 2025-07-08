import express from 'express';
import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticleList,
  likeArticle,
  unlikeArticle
} from '../controllers/article.controller.js';
import { validateArticle } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { requireOwnership } from '../middlewares/ownership.js';

const router = express.Router();

// 게시글 목록 조회, 생성
router.route('/')
  .get(getArticleList)
  .post(authenticate, validateArticle, createArticle);

// 게시글 상세 조회, 수정, 삭제
router.route('/:id')
  .get(authenticate, getArticleById)
  .patch(authenticate, requireOwnership('article'), updateArticle)
  .delete(authenticate, requireOwnership('article'), deleteArticle);

// 좋아요/좋아요 취소
router.post('/:id/like', authenticate, likeArticle);
router.delete('/:id/like', authenticate, unlikeArticle);

export default router;
