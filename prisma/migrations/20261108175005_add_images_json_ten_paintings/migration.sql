-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "price" INTEGER NOT NULL,
    "compareAtPrice" INTEGER,
    "categoryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "motifKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagesJson" TEXT NOT NULL DEFAULT '[]',
    "tagline" TEXT,
    "tagsJson" TEXT NOT NULL DEFAULT '[]',
    "sizesJson" TEXT NOT NULL DEFAULT '[]',
    "framesJson" TEXT NOT NULL DEFAULT '[]',
    "colorsJson" TEXT NOT NULL DEFAULT '[]',
    "bordersJson" TEXT NOT NULL DEFAULT '[]',
    "stock" INTEGER NOT NULL DEFAULT 12,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "customizable" BOOLEAN NOT NULL DEFAULT true,
    "artistNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("artistNote", "bordersJson", "categoryId", "colorsJson", "compareAtPrice", "createdAt", "customizable", "description", "featured", "framesJson", "id", "imageUrl", "longDescription", "motifKey", "name", "price", "sizesJson", "slug", "stock", "tagline", "tagsJson", "type", "updatedAt") SELECT "artistNote", "bordersJson", "categoryId", "colorsJson", "compareAtPrice", "createdAt", "customizable", "description", "featured", "framesJson", "id", "imageUrl", "longDescription", "motifKey", "name", "price", "sizesJson", "slug", "stock", "tagline", "tagsJson", "type", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
