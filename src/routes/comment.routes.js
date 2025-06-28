import express from 'express';
import {
  createProductComment,
  createArticleComment,
  getProductComments,
  getArticleComments,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js';

import { validateComment } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { requireOwnership } from '../middlewares/ownership.js';

const router = express.Router();

// 상품 댓글
router.route('/products/:productId/comments')
  .get(getProductComments)
  .post(
    authenticate,
    validateComment,
    createProductComment
  );

// 게시글 댓글
router.route('/articles/:articleId/comments')
  .get(getArticleComments)
  .post(
    authenticate,
    validateComment,
    createArticleComment
  );

// 댓글 수정/삭제
router.route('/comments/:commentId')
  .patch(
    authenticate,
    requireOwnership('comment'),
    updateComment
  )
  .delete(
    authenticate,
    requireOwnership('comment'),
    deleteComment
  );

export default router;
