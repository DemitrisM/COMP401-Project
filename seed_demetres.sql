PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

/*-----------------------------------------------------------------
1) Make sure the existing account is a SELLER
------------------------------------------------------------------*/
UPDATE USERS
   SET Role = 'SELLER'
 WHERE Email = 'demetresmavridi@gmail.com';

/*-----------------------------------------------------------------
2) Insert the eight products for that seller
------------------------------------------------------------------*/
INSERT INTO PRODUCTS (SellerID ,Name                        ,Category)
SELECT UserID,'Wall sconce'             ,'Lighting'   FROM USERS WHERE Email='demetresmavridi@gmail.com'
UNION ALL
SELECT UserID,'Square planter'          ,'Garden'     FROM USERS WHERE Email='demetresmavridi@gmail.com'
UNION ALL
SELECT UserID,'Ivy fridge magnet'       ,'Kitchen'    FROM USERS WHERE Email='demetresmavridi@gmail.com'
UNION ALL
SELECT UserID,'Monstera coasters'       ,'Home décor' FROM USERS WHERE Email='demetresmavridi@gmail.com'
UNION ALL
SELECT UserID,'Trellis storage system'  ,'Storage'    FROM USERS WHERE Email='demetresmavridi@gmail.com'
UNION ALL
SELECT UserID,'Planet lamp'             ,'Lighting'   FROM USERS WHERE Email='demetresmavridi@gmail.com'
UNION ALL
SELECT UserID,'Dragon controller holder','Gadgets'    FROM USERS WHERE Email='demetresmavridi@gmail.com'
UNION ALL
SELECT UserID,'Tissue box cover'        ,'Bathroom'   FROM USERS WHERE Email='demetresmavridi@gmail.com';

/*-----------------------------------------------------------------
3) One SKU row per product (match on Name + SellerID)
------------------------------------------------------------------*/
INSERT INTO SKU (ProdID,Colour,Price,Description,Picture)
SELECT p.ProdID,NULL,24.99,'Elegant wall sconce for a stylish and modern home.','Wall_lamp.png'
  FROM PRODUCTS p
  JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name='Wall sconce'            AND u.Email='demetresmavridi@gmail.com'
UNION ALL
SELECT p.ProdID,NULL,18.50,'Modern square planter for any home.','Square_planter.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID=p.SellerID
 WHERE p.Name='Square planter'         AND u.Email='demetresmavridi@gmail.com'
UNION ALL
SELECT p.ProdID,NULL, 6.95,'Ivy and flower magnets for your fridge.','Fridge_Magnets.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID=p.SellerID
 WHERE p.Name='Ivy fridge magnet'      AND u.Email='demetresmavridi@gmail.com'
UNION ALL
SELECT p.ProdID,NULL,15.00,'Monstera plant with a hidden coaster set.','Coaster.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID=p.SellerID
 WHERE p.Name='Monstera coasters'      AND u.Email='demetresmavridi@gmail.com'
UNION ALL
SELECT p.ProdID,NULL,129.90,'Wall storage system with lots of accessories.','Trellis.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID=p.SellerID
 WHERE p.Name='Trellis storage system' AND u.Email='demetresmavridi@gmail.com'
UNION ALL
SELECT p.ProdID,NULL,39.90,'A unique 3-D printed planet lamp.','Planets.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID=p.SellerID
 WHERE p.Name='Planet lamp'            AND u.Email='demetresmavridi@gmail.com'
UNION ALL
SELECT p.ProdID,NULL,29.99,'Auto-locking dragon controller holder.','Holder.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID=p.SellerID
 WHERE p.Name='Dragon controller holder' AND u.Email='demetresmavridi@gmail.com'
UNION ALL
SELECT p.ProdID,NULL,12.00,'Whale-inspired tissue box cover for kids.','Tissue_holder.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID=p.SellerID
 WHERE p.Name='Tissue box cover'       AND u.Email='demetresmavridi@gmail.com';

COMMIT;
