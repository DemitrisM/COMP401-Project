BEGIN TRANSACTION;

/* === USERS =================================================================
   A single table for every login. 'Role' determines capability:
   CUSTOMER = buyer only           SELLER   = can list/modify products         */
CREATE TABLE IF NOT EXISTS USERS (
    UserID     INTEGER PRIMARY KEY AUTOINCREMENT,
    Email      TEXT    NOT NULL UNIQUE,
    Password   TEXT    NOT NULL,
    Username   TEXT    NOT NULL,
    Name       TEXT,
    Surname    TEXT,
    Role       TEXT    NOT NULL DEFAULT 'CUSTOMER'
                CHECK (Role IN ('CUSTOMER','SELLER'))
);

/* === PRODUCTS & VARIATIONS (SKU) ========================================= */
CREATE TABLE IF NOT EXISTS PRODUCTS (
    ProdID     INTEGER PRIMARY KEY AUTOINCREMENT,
    SellerID   INTEGER NOT NULL,                 -- NEW: owner of the listing
    Name       TEXT    NOT NULL,
    Category   TEXT,
    FOREIGN KEY (SellerID) REFERENCES USERS(UserID)
          ON DELETE CASCADE                      -- if seller account is removed
);

/* Each sellable variant of a product */
CREATE TABLE IF NOT EXISTS SKU (
    SKUID       INTEGER PRIMARY KEY AUTOINCREMENT,
    ProdID      INTEGER NOT NULL,
    Colour      TEXT,
    Price       REAL    NOT NULL,
    Description TEXT,
    Picture     TEXT,
    FOREIGN KEY (ProdID) REFERENCES PRODUCTS(ProdID)
);

/* === CART / ORDER ======================================================== */
CREATE TABLE IF NOT EXISTS CARTS (
    CartID      INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID      INTEGER NOT NULL,
    CartDone    INTEGER NOT NULL DEFAULT 0
                   CHECK (CartDone IN (0,1)),   -- 0=open, 1=confirmed
    TotalAmount REAL,
    Status      TEXT    DEFAULT 'OPEN',         -- OPEN | CONFIRMED
    ConfirmedAt TEXT,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID)
);

CREATE TABLE IF NOT EXISTS CARTPRODUCTS (
    CartID INTEGER NOT NULL,
    SKUID  INTEGER NOT NULL,
    Qty    INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (CartID, SKUID),
    FOREIGN KEY (CartID) REFERENCES CARTS(CartID)
           ON DELETE CASCADE,
    FOREIGN KEY (SKUID)  REFERENCES SKU(SKUID)
);

COMMIT;
