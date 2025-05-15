````markdown
# WebWeavers E-Commerce Demo

A minimal Node/Express + SQLite shop prototype featuring:
- **CUSTOMER** vs **SELLER** roles  
- Products → SKUs  
- Cart create / add-to-cart / list-items APIs  
- Front-end: browse, add to cart drawer, checkout page  

---

## 🔧 1. Clone & Install

```bash
git clone https://github.com/<your-org>/COMP401-Project.git
cd COMP401-Project
npm install
````

---

## 🗄️ 2. Initialize the Database

### 2.1 Create the schema

```bash
sqlite3 dreamweaver_db.sqlite < dreamweaver_db.sql
```

This will create the following tables:

* `USERS`
* `PRODUCTS`
* `SKU`
* `CARTS`
* `CARTPRODUCTS`

### 2.2 Seed a demo **SELLER** & their eight products

> **Tip:** You can parameterize the seller’s email so anyone can run this script without editing it directly.

```bash
export SELLER_EMAIL="demetresmavridi@gmail.com"

sqlite3 dreamweaver_db.sqlite \
  -init <(printf '.parameter init\n.parameter set EMAIL "%s"\n.read seed.sql\n' "$SELLER_EMAIL") \
  ""
```

> **Alternative (no shell tricks):**
> Open `seed.sql`, replace every occurrence of
> `'demetresmavridi@gmail.com'` with your own email, then run:
>
> ```bash
> sqlite3 dreamweaver_db.sqlite < seed.sql
> ```

---

### ─── Contents of `seed.sql` ───────────────────────────

```sql
PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

-- 1) Make sure the existing account is a SELLER
UPDATE USERS
   SET Role = 'SELLER'
 WHERE Email = :EMAIL;

-- 2) Insert eight products for that seller
INSERT INTO PRODUCTS (SellerID, Name, Category)
SELECT UserID, 'Wall sconce',              'Lighting'   FROM USERS WHERE Email = :EMAIL
UNION ALL
SELECT UserID, 'Square planter',           'Garden'     FROM USERS WHERE Email = :EMAIL
UNION ALL
SELECT UserID, 'Ivy fridge magnet',        'Kitchen'    FROM USERS WHERE Email = :EMAIL
UNION ALL
SELECT UserID, 'Monstera coasters',        'Home décor' FROM USERS WHERE Email = :EMAIL
UNION ALL
SELECT UserID, 'Trellis storage system',   'Storage'    FROM USERS WHERE Email = :EMAIL
UNION ALL
SELECT UserID, 'Planet lamp',              'Lighting'   FROM USERS WHERE Email = :EMAIL
UNION ALL
SELECT UserID, 'Dragon controller holder', 'Gadgets'    FROM USERS WHERE Email = :EMAIL
UNION ALL
SELECT UserID, 'Tissue box cover',         'Bathroom'   FROM USERS WHERE Email = :EMAIL;

-- 3) One SKU row per product
INSERT INTO SKU (ProdID, Colour, Price, Description, Picture)
SELECT p.ProdID, NULL, 24.99, 'Elegant wall sconce for a stylish and modern home.',      'Wall_lamp.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name = 'Wall sconce'             AND u.Email = :EMAIL
UNION ALL
SELECT p.ProdID, NULL, 18.50, 'Modern square planter for any home.',                    'Square_planter.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name = 'Square planter'          AND u.Email = :EMAIL
UNION ALL
SELECT p.ProdID, NULL,  6.95, 'Ivy and flower magnets for your fridge.',                'Fridge_Magnets.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name = 'Ivy fridge magnet'       AND u.Email = :EMAIL
UNION ALL
SELECT p.ProdID, NULL, 15.00, 'Monstera plant with a hidden coaster set.',              'Coaster.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name = 'Monstera coasters'       AND u.Email = :EMAIL
UNION ALL
SELECT p.ProdID, NULL,129.90, 'Wall storage system with lots of accessories.',           'Trellis.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name = 'Trellis storage system'  AND u.Email = :EMAIL
UNION ALL
SELECT p.ProdID, NULL, 39.90, 'A unique 3-D printed planet lamp.',                     'Planets.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name = 'Planet lamp'             AND u.Email = :EMAIL
UNION ALL
SELECT p.ProdID, NULL, 29.99, 'Auto-locking dragon controller holder.',                 'Holder.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name = 'Dragon controller holder' AND u.Email = :EMAIL
UNION ALL
SELECT p.ProdID, NULL, 12.00, 'Whale-inspired tissue box cover for kids.',             'Tissue_holder.png'
  FROM PRODUCTS p JOIN USERS u ON u.UserID = p.SellerID
 WHERE p.Name = 'Tissue box cover'        AND u.Email = :EMAIL;

COMMIT;
```

---

## ▶️ 3. Run the Server

```bash
node server.js
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 👤 Demo Seller Account

* **Email:** `demetresmavridi@gmail.com`
* **Password:** `1234`

*Or sign up as **CUSTOMER** via POST `/signup`.*

---

## 📖 Usage

1. Browse **ALL PRODUCTS** on the home page
2. Click “Add To Cart” → open cart drawer via 🛒 icon
3. Adjust quantities or click **CHECKOUT**
4. Use the **profile** dropdown to **Log out**

---

## 🛠 Troubleshooting

* **`NOT NULL constraint failed: CARTS.UserID`**
  Ensure you have at least one user in `USERS` before creating a cart.
* **Duplicate products in catalog**
  Verify that `/api/products` groups SKUs into a single row per product.

```
```
