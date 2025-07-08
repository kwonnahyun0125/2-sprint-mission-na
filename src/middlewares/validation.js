// 상품 검증
export const validateProduct = (req, res, next) => {
  const { name, description, price, tags, imageUrl } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: '상품 이름이 유효하지 않습니다.' });
  }
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: '상품 설명이 유효하지 않습니다.' });
  }
  // 숫자 및 0 이상만 허용
  const priceNum = Number(price);
  if (price === undefined || isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: '가격은 0 이상의 숫자여야 합니다.' });
  }
  if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
    return res.status(400).json({ error: '태그는 문자열 배열이어야 합니다.' });
  }
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return res.status(400).json({ error: '이미지 URL이 필요합니다.' });
  }

  next();
};


// 게시글 검증
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

// 댓글 검증
export const validateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: '댓글 내용이 유효하지 않습니다.' });
  }
  next();
};

