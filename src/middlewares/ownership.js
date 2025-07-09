import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export function requireOwnership(model) {
  return async (req, res, next) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    // 권한 체크
    if (model === 'product') {
      const record = await prisma.product.findUnique({ where: { id } });
      if (!record) return res.status(404).json({ message: 'Product not found' });
      if (record.ownerId !== req.user.id)
        return res.status(403).json({ message: 'No permission to access this product' });
    } else if (model === 'article') {
      const record = await prisma.article.findUnique({ where: { id } });
      if (!record) return res.status(404).json({ message: 'Article not found' });
      if (record.authorId !== req.user.id)
        return res.status(403).json({ message: 'No permission to access this article' });
    } else if (model === 'comment') {
      const record = await prisma.comment.findUnique({ where: { id } });
      if (!record) return res.status(404).json({ message: 'Comment not found' });
      if (record.authorId !== req.user.id)
        return res.status(403).json({ message: 'No permission to access this comment' });
    } else {
      return res.status(400).json({ message: 'Unknown model type for ownership check' });
    }

    next();
  };
}
