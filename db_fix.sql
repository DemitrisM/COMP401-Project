PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

-- 1. Keep only the first SKU row per product
DELETE FROM SKU
WHERE  SKUID NOT IN (
        SELECT MIN(SKUID)
        FROM   SKU
        GROUP  BY ProdID
);

-- 2. Optional: prevent the same variant being inserted twice again
CREATE UNIQUE INDEX IF NOT EXISTS idx_sku_unique
       ON SKU (ProdID, Colour);

COMMIT;
