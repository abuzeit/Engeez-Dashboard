-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payoutId" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requestDate" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "accountEnd" TEXT NOT NULL,
    "payoutType" TEXT NOT NULL DEFAULT 'Withdrawal',
    "walletTotalBalance" TEXT NOT NULL DEFAULT '0.00',
    "walletAvailableBalance" TEXT NOT NULL DEFAULT '0.00',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Payout" ("accountEnd", "amount", "bank", "createdAt", "driver", "id", "payoutId", "requestDate", "status", "updatedAt") SELECT "accountEnd", "amount", "bank", "createdAt", "driver", "id", "payoutId", "requestDate", "status", "updatedAt" FROM "Payout";
DROP TABLE "Payout";
ALTER TABLE "new_Payout" RENAME TO "Payout";
CREATE UNIQUE INDEX "Payout_payoutId_key" ON "Payout"("payoutId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
