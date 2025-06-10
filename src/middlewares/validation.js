export const validateProduct = (req, res, next) => {
  const { name, description, price, tags, imageUrl } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: '상품 이름이 유효하지 않습니다.' });
  }

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: '상품 설명이 유효하지 않습니다.' });
  }

  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ error: '가격은 숫자여야 합니다.' });
  }

  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: '태그는 배열이어야 합니다.' });
  }

  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: '이미지 URL이 필요합니다.' });
  }

  next();
};

export const validateArticle = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: '게시물 제목이 유효하지 않습니다.' });
  }

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: '게시물 내용이 유효하지 않습니다.' });
  }

  next();
};

export const validateComment = (req, res, next) => {
  const { content, productId, articleId } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: '댓글 내용이 유효하지 않습니다.' });
  }

  if (!productId && !articleId) {
    return res.status(400).json({ error: 'productId 또는 articleId 중 하나는 필수입니다.' });
  }

  next();
};