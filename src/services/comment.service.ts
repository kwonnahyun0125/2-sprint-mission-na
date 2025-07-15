import { PrismaClient } from '@prisma/client';
import { CreateCommentInput, UpdateCommentInput } from '../dtos/comment.dto';

const prisma = new PrismaClient();

export class CommentService {
  // 상품에 댓글 생성
  static async createProductComment(
    productId: number,
    authorId: number,
    data: CreateCommentInput
  ) {
    return prisma.comment.create({
      data: {
        ...data,
        authorId,
        productId,
        articleId: null,
      },
    });
  }

  // 게시글에 댓글 생성
  static async createArticleComment(
    articleId: number,
    authorId: number,
    data: CreateCommentInput
  ) {
    return prisma.comment.create({
      data: {
        ...data,
        authorId,
        articleId,
        productId: null,
      },
    });
  }

  // 상품 댓글 목록
  static async getProductComments(productId: number, cursor?: number, take: number = 10) {
    return prisma.comment.findMany({
      where: { productId },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  // 게시글 댓글 목록
  static async getArticleComments(articleId: number, cursor?: number, take: number = 10) {
    return prisma.comment.findMany({
      where: { articleId },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
  }

  // 댓글 수정
  static async updateComment(commentId: number, data: UpdateCommentInput) {
    return prisma.comment.update({
      where: { id: commentId },
      data,
    });
  }

  // 댓글 삭제
  static async deleteComment(commentId: number) {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
