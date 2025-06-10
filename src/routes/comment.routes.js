import express from 'express';
import {
  createProductComment,
  createArticleComment,
  getProductComments,
  getArticleComments,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js';

import { validateComment } from '../middlewares/validation.js';

const router = express.Router();

// 상품 댓글 
router.route('/products/:productId/comments')
  .get(getProductComments)
  .post(validateComment, createProductComment);

// 게시글 댓글
router.route('/articles/:articleId/comments')
  .get(getArticleComments)
  .post(validateComment, createArticleComment);

  router.route('/comments/:commentId')
  .patch(updateComment)
  .delete(deleteComment);

export default router;
