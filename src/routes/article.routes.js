import express from 'express';
import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticleList
} from '../controllers/article.controller.js';

import { validateArticle } from '../middlewares/validation.js';

const router = express.Router();

// 게시글 목록 조회, 생성 (중복 라우트 방지)
router.route('/')
  .get(getArticleList)
  .post(validateArticle, createArticle);

// 게시글 상세 조회, 수정, 삭제 (중복 라우트 방지)
router.route('/:id')
  .get(getArticleById)
  .patch(updateArticle)
  .delete(deleteArticle);

export default router;
