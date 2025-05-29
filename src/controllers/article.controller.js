import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

// 1. 게시글 생성
export const createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// 2. 게시글 단건 조회
export const getArticleById = async (req, res, next) => {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!article) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

// 게시글 전체 목록 조회
export const getArticleList = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, search = '' } = req.query;

    const articles = await prisma.article.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

// 게시글 수정
export const updateArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const updated = await prisma.article.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        title,
        content,
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// 게시글 삭제
export const deleteArticle = async (req, res, next) => {
  try {
    await prisma.article.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
