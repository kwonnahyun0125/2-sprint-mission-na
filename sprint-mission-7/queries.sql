-- 1. 내 정보 업데이트 하기
UPDATE users
SET nickname = 'test'
WHERE id = 1;

-- 2. 내가 생성한 상품 조회 (3번째 페이지, 10개씩)
SELECT * FROM products
WHERE user_id = 1 AND is_deleted = FALSE
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;

-- 3. 내가 생성한 상품의 총 개수
SELECT COUNT(*) FROM products
WHERE user_id = 1 AND is_deleted = FALSE;

-- 4. 내가 좋아요 누른 상품 조회 (3번째 페이지, 10개씩)
SELECT p.*
FROM likes l
JOIN products p ON l.product_id = p.id
WHERE l.user_id = 1 AND p.is_deleted = FALSE
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 20;

-- 5. 내가 좋아요 누른 상품의 총 개수
SELECT COUNT(*)
FROM likes l
JOIN products p ON l.product_id = p.id
WHERE l.user_id = 1 AND p.is_deleted = FALSE;

-- 6. 상품 생성
INSERT INTO products (user_id, title, description, price)
VALUES (1, '중고 노트북 팝니다', '거의 새 제품입니다.', 700000);

-- 7. 상품 목록 조회 (검색어 포함, 좋아요 수 포함, 1페이지)
SELECT p.*, COUNT(l.user_id) AS like_count
FROM products p
LEFT JOIN likes l ON p.id = l.product_id
WHERE p.title ILIKE '%test%' AND p.is_deleted = FALSE
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;

-- 8. 상품 상세 조회 (1번 상품)
SELECT * FROM products
WHERE id = 1 AND is_deleted = FALSE;

-- 9. 상품 수정
UPDATE products
SET title = '수정된 상품명', description = '설명 수정됨', price = 600000, updated_at = CURRENT_TIMESTAMP
WHERE id = 1 AND user_id = 1;

-- 10. 상품 삭제
UPDATE products
SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
WHERE id = 1 AND user_id = 1;

-- 11. 상품 좋아요
INSERT INTO likes (user_id, product_id)
VALUES (1, 2)
ON CONFLICT DO NOTHING;

-- 12. 상품 좋아요 취소
DELETE FROM likes
WHERE user_id = 1 AND product_id = 2;

-- 13. 상품 댓글 작성
INSERT INTO comments (product_id, user_id, content)
VALUES (2, 1, '이 상품 아직 구매 가능할까요?');

-- 14. 상품 댓글 조회 (2025-03-25 기준 커서 페이지네이션)
SELECT *
FROM comments
WHERE product_id = 1 AND created_at < '2025-03-25'
ORDER BY created_at DESC
LIMIT 10;