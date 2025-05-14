BEGIN TRANSACTION;

/* -----------------------------------------------------------
   1. Seller account  (only added if it doesn't already exist)
      Password "1234" hashed with bcrypt cost 10
      (hash generated once; server bcrypt.compare will validate)
----------------------------------------------------------- */
INSERT INTO USERS (Email,Password,Username,Role)
SELECT 'demetresmavridi@gmail.com',
       '$2b$10$wqH4hWcnnr5lTyBC0b.poewT9DW0h6IcjjZI2PH1PtaP6sJT9kK8e', -- pw=1234
       'Demetres',
       'SELLER'
WHERE NOT EXISTS (
  SELECT 1 FROM USERS WHERE Email='demetresmavridi@gmail.com'
);

/* Capture this SellerID (whether newly inserted or pre-existing) */
WITH s AS (
  SELECT UserID AS SellerID
    FROM USERS
   WHERE Email='demetresmavridi@gmail.com'
)

/* -----------------------------------------------------------
   2. PRODUCT rows (if not already present)
----------------------------------------------------------- */
INSERT INTO PRODUCTS (SellerID, Name, Category)
SELECT SellerID, 'Wall Sconce',            'Lighting'       FROM s
WHERE NOT EXISTS (SELECT 1 FROM PRODUCTS WHERE Name='Wall Sconce')
UNION ALL
SELECT SellerID, 'Square Planter',         'Home Decor'     FROM s
WHERE NOT EXISTS (SELECT 1 FROM PRODUCTS WHERE Name='Square Planter')
UNION ALL
SELECT SellerID, 'Ivy Fridge Magnets',     'Kitchen'        FROM s
WHERE NOT EXISTS (SELECT 1 FROM PRODUCTS WHERE Name='Ivy Fridge Magnets')
UNION ALL
SELECT SellerID, 'Monstera Coasters',      'Kitchen'        FROM s
WHERE NOT EXISTS (SELECT 1 FROM PRODUCTS WHERE Name='Monstera Coasters')
UNION ALL
SELECT SellerID, 'Trellis Storage System', 'Organization'   FROM s
WHERE NOT EXISTS (SELECT 1 FROM PRODUCTS WHERE Name='Trellis Storage System')
UNION ALL
SELECT SellerID, 'Planet Lamps',           'Lighting'       FROM s
WHERE NOT EXISTS (SELECT 1 FROM PRODUCTS WHERE Name='Planet Lamps')
UNION ALL
SELECT SellerID, 'Dragon Controller Holder','Gaming'        FROM s
WHERE NOT EXISTS (SELECT 1 FROM PRODUCTS WHERE Name='Dragon Controller Holder')
UNION ALL
SELECT SellerID, 'Tissue Box Cover',       'Kids/Decor'     FROM s
WHERE NOT EXISTS (SELECT 1 FROM PRODUCTS WHERE Name='Tissue Box Cover');

/* -----------------------------------------------------------
   3. SKU rows for each product (insert only if missing)
----------------------------------------------------------- */
INSERT INTO SKU (ProdID, Colour, Price, Description, Picture)
SELECT ProdID, 'White', 89.00, 'Elegant wall sconce','images/Wall_lamp.png'
  FROM PRODUCTS WHERE Name='Wall Sconce'
  AND NOT EXISTS (SELECT 1 FROM SKU WHERE ProdID = PRODUCTS.ProdID)
UNION ALL
SELECT ProdID, 'Grey', 49.00, 'Modern square planter','images/Square_planter.png'
  FROM PRODUCTS WHERE Name='Square Planter'
  AND NOT EXISTS (SELECT 1 FROM SKU WHERE ProdID = PRODUCTS.ProdID)
UNION ALL
SELECT ProdID, NULL, 19.00, 'Ivy & flower fridge magnets','images/Fridge_Magnets.png'
  FROM PRODUCTS WHERE Name='Ivy Fridge Magnets'
  AND NOT EXISTS (SELECT 1 FROM SKU WHERE ProdID = PRODUCTS.ProdID)
UNION ALL
SELECT ProdID, NULL, 35.00, 'Monstera plant coaster set','images/Coaster.png'
  FROM PRODUCTS WHERE Name='Monstera Coasters'
  AND NOT EXISTS (SELECT 1 FROM SKU WHERE ProdID = PRODUCTS.ProdID)
UNION ALL
SELECT ProdID, NULL, 120.00,'Wall storage system with accessories','images/Trellis.png'
  FROM PRODUCTS WHERE Name='Trellis Storage System'
  AND NOT EXISTS (SELECT 1 FROM SKU WHERE ProdID = PRODUCTS.ProdID)
UNION ALL
SELECT ProdID, NULL, 75.00,'Set of unique planet lamps','images/Planets.png'
  FROM PRODUCTS WHERE Name='Planet Lamps'
  AND NOT EXISTS (SELECT 1 FROM SKU WHERE ProdID = PRODUCTS.ProdID)
UNION ALL
SELECT ProdID, NULL, 59.00,'Auto-locking dragon controller holder','images/Holder.png'
  FROM PRODUCTS WHERE Name='Dragon Controller Holder'
  AND NOT EXISTS (SELECT 1 FROM SKU WHERE ProdID = PRODUCTS.ProdID)
UNION ALL
SELECT ProdID, NULL, 27.00,'Whale-inspired tissue box cover','images/Tissue_holder.png'
  FROM PRODUCTS WHERE Name='Tissue Box Cover'
  AND NOT EXISTS (SELECT 1 FROM SKU WHERE ProdID = PRODUCTS.ProdID);

COMMIT;
