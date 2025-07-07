import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

// 1. 게시글 생성
export const createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId: req.user.id,
        imageUrl,
      },
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// 2. 게시글 단건 조회 (isLiked, 좋아요 수 포함)
export const getArticleById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // 좋아요 포함해서 조회
    const article = await prisma.article.findUnique({
      where: { id },
      include: req.user
        ? { 
            likes: { 
              where: { userId: req.user.id }, 
              select: { id: true } 
            },
          }
        : {},
    });

    if (!article) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    // isLiked 
    const isLiked = req.user ? (article.likes && article.likes.length > 0) : false;

    const likeCount = await prisma.articleLike.count({
      where: { articleId: id }
    });
    
    // articleLikes 필드 제거
    const { articleLikes, ...rest } = article;
    
    return res.status(200).json({ ...rest, isLiked, likeCount });
  } catch (err) {
    next(err);
  }
};


// 3. 게시글 전체 목록 조회
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


// 4. 게시글 수정
export const updateArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const updated = await prisma.article.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, imageUrl },
    });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// 5. 게시글 삭제
export const deleteArticle = async (req, res, next) => {
  try {
    await prisma.article.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 6. 게시글 좋아요
export const likeArticle = async (req, res, next) => {
  try {
    await prisma.articleLike.upsert({
      where: {
        userId_articleId: {
          userId: req.user.id,
          articleId: parseInt(req.params.id),
        },
      },
      create: {
        userId: req.user.id,
        articleId: parseInt(req.params.id),
      },
      update: {},
    });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// 7. 게시글 좋아요 취소
export const unlikeArticle = async (req, res, next) => {
  try {
    await prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId: req.user.id,
          articleId: parseInt(req.params.id),
        },
      },
    });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};