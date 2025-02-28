/*
  Warnings:

  - Added the required column `tenantId` to the `LinkGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LinkGroup" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LinkGroup" ADD CONSTRAINT "LinkGroup_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
