/*
  Warnings:

  - Added the required column `itemValue` to the `LinkOnPublicPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `LinkOnPublicPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LinkOnPublicPage" ADD COLUMN     "itemType" TEXT NOT NULL DEFAULT 'link',
ADD COLUMN     "itemValue" TEXT NOT NULL,
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LinkOnPublicPage" ADD CONSTRAINT "LinkOnPublicPage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
